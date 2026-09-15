// Ziina webhook receiver for rental payments. Marks the matching
// rental_orders row completed/failed once Ziina actually confirms the
// payment -- the success_url redirect alone is not proof of payment (a
// visitor could navigate there manually without paying), so this webhook
// is the only authoritative source of truth, same posture as
// anqor_command/setta/backend/services/ziina.py.
//
// Verification mirrors that same file exactly: HMAC-SHA256 over the raw
// body compared against X-Hmac-Signature (constant-time), AND the request
// IP checked against Ziina's documented webhook IP list -- defense in
// depth, not either check alone.
//
// Setup (one-time, by hand, once ZIINA_API_KEY and ZIINA_WEBHOOK_SECRET
// are both set in this project's Vercel env vars):
//   curl -X POST https://api-v2.ziina.com/api/webhook \
//     -H "Authorization: Bearer $ZIINA_API_KEY" -H "Content-Type: application/json" \
//     -d '{"url":"https://anqorstudios.com/api/rental-webhook","secret":"'"$ZIINA_WEBHOOK_SECRET"'"}'

const crypto = require('crypto');

const SUPABASE_URL = 'https://hmsaysnufuenadohfhpl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtc2F5c251ZnVlbmFkb2hmaHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMjM1MTUsImV4cCI6MjA5Mzc5OTUxNX0.OlEQgmohTXgnZ9nadizbhhBRO5FhiDTYy-AjGY-WL4w';

// Documented at docs.ziina.com/api-reference/webhook -- same list used in
// Setta's own adapter, copied verbatim rather than re-derived.
const ALLOWED_WEBHOOK_IPS = new Set(['3.29.184.186', '3.29.190.95', '20.233.47.127', '13.202.161.181']);

function verifySignature(rawBody, signatureHeader, secret) {
  if (!secret || !signatureHeader) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHeader);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (fwd ? fwd.split(',')[0].trim() : req.socket?.remoteAddress) || '';
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const secret = process.env.ZIINA_WEBHOOK_SECRET;
  const rawBody = JSON.stringify(req.body || {});
  const signature = req.headers['x-hmac-signature'];

  if (!ALLOWED_WEBHOOK_IPS.has(clientIp(req))) {
    console.error('rental-webhook: rejected, unexpected source IP', clientIp(req));
    return res.status(403).json({ error: 'Unrecognized source' });
  }
  if (!verifySignature(rawBody, signature, secret)) {
    console.error('rental-webhook: rejected, signature mismatch');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = req.body || {};
  const paymentIntentId = event.id;
  const status = event.status; // completed | failed | canceled | ...
  if (!paymentIntentId || !status) {
    return res.status(400).json({ error: 'Missing id or status' });
  }

  const mappedStatus = status === 'completed' ? 'completed' : status === 'failed' || status === 'canceled' ? 'failed' : 'pending';

  try {
    const resp = await fetch(
      `${SUPABASE_URL}/rest/v1/rental_orders?ziina_payment_intent_id=eq.${encodeURIComponent(paymentIntentId)}`,
      {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: mappedStatus }),
      }
    );
    if (!resp.ok) throw new Error(`Supabase update failed (${resp.status}): ${await resp.text()}`);
  } catch (e) {
    console.error('rental-webhook: failed to update order', e.message);
    return res.status(500).json({ error: 'Failed to record payment status' });
  }

  res.status(200).json({ received: true });
};
