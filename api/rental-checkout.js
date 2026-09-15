// Rental checkout — creates a pending order, then a Ziina Payment Intent,
// and hands the browser a redirect_url to Ziina's hosted checkout page.
//
// Mirrors the real, working Ziina integration already running in Setta
// (anqor_command/setta/backend/services/ziina.py) -- same API base, same
// fils-based amount convention, same reason for the order-first ordering:
// Ziina's Payment Intent has no metadata field at all, so the ONLY way an
// incoming webhook (which carries nothing but Ziina's own fields) can be
// tied back to what was actually ordered is a row that already existed
// before the redirect, keyed by the payment_intent id once Ziina returns it.
//
// Requires ZIINA_API_KEY in this project's Vercel env vars (from
// ziina.com/business/connect) -- returns 500 with a clear message if unset,
// rather than a confusing downstream failure.

const SUPABASE_URL = 'https://hmsaysnufuenadohfhpl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhtc2F5c251ZnVlbmFkb2hmaHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMjM1MTUsImV4cCI6MjA5Mzc5OTUxNX0.OlEQgmohTXgnZ9nadizbhhBRO5FhiDTYy-AjGY-WL4w';
const ZIINA_API_BASE = 'https://api-v2.ziina.com/api';

async function supabaseInsert(table, row) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(row),
  });
  if (!resp.ok) throw new Error(`Supabase insert into ${table} failed (${resp.status}): ${await resp.text()}`);
  const [inserted] = await resp.json();
  return inserted;
}

async function supabasePatch(table, id, patch) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patch),
  });
  if (!resp.ok) throw new Error(`Supabase patch on ${table} failed (${resp.status}): ${await resp.text()}`);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ZIINA_API_KEY = process.env.ZIINA_API_KEY;
  if (!ZIINA_API_KEY) {
    return res.status(500).json({ error: 'ZIINA_API_KEY is not set on this deployment.' });
  }

  const { items, assistance, customerName, customerEmail, customerPhone } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Add at least one rental item.' });
  }
  if (!customerName || !customerEmail) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }
  for (const item of items) {
    if (!item.name || !(item.day_rate_aed > 0) || !(item.quantity > 0)) {
      return res.status(400).json({ error: `Invalid item: ${JSON.stringify(item)}` });
    }
  }

  // Single-day rental only, by design -- day_rate_aed is charged once per
  // unit selected, not multiplied by any date range.
  const subtotalAed = items.reduce((sum, i) => sum + i.day_rate_aed * i.quantity, 0);
  const totalAed = assistance ? Math.round(subtotalAed * 1.2 * 100) / 100 : subtotalAed;

  let order;
  try {
    order = await supabaseInsert('rental_orders', {
      items,
      assistance: !!assistance,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      total_aed: totalAed,
      status: 'pending',
    });
  } catch (e) {
    console.error('rental-checkout: order insert failed', e.message);
    return res.status(500).json({ error: 'Could not create the order. Please try again.' });
  }

  const origin = req.headers.origin || `https://${req.headers.host}`;
  const itemSummary = items.map(i => `${i.quantity}x ${i.name}`).join(', ');

  let ziinaResp;
  try {
    const resp = await fetch(`${ZIINA_API_BASE}/payment_intent`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ZIINA_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Math.round(totalAed * 100), // fils
        currency_code: 'AED',
        message: `Anqor Studios rental — ${itemSummary}`.slice(0, 250),
        success_url: `${origin}/rental?success=1&order=${order.id}`,
        cancel_url: `${origin}/rental?cancelled=1&order=${order.id}`,
        failure_url: `${origin}/rental?failed=1&order=${order.id}`,
      }),
    });
    if (!resp.ok) throw new Error(`Ziina create_payment_intent failed (${resp.status}): ${(await resp.text()).slice(0, 300)}`);
    ziinaResp = await resp.json();
  } catch (e) {
    console.error('rental-checkout: Ziina payment intent failed', e.message);
    await supabasePatch('rental_orders', order.id, { status: 'failed' }).catch(() => {});
    return res.status(502).json({ error: 'Payment provider error. Please try again.' });
  }

  await supabasePatch('rental_orders', order.id, { ziina_payment_intent_id: ziinaResp.id }).catch(err =>
    console.error('rental-checkout: failed to record payment_intent id', err.message)
  );

  res.status(200).json({ url: ziinaResp.redirect_url });
};
