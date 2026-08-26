// Telegram bot webhook for expense capture: a photo of a receipt sent to
// the bot is downloaded, vision-extracted (vendor/date/total/category) via
// Claude, and inserted into the `expenses` table. Modeled on Dreamfade's
// WhatsApp receipt pipeline (backend/services/receipt_extractor.py) but
// simplified for Anqor's single-business ledger — no multi-tenant workspace
// routing, no external accounting-platform push, just a row in `expenses`.
//
// A low-confidence extraction, an unreadable total, an unrecognized
// category, or a non-AED currency (this table has no currency column, so a
// foreign amount can't be safely written into amount_aed) all land the row
// with needs_review=true instead of a guessed number — never silently
// records a wrong amount. review flag is cleared by a human on the
// Expenses page.
//
// Only chat IDs listed in AUTHORIZED_TELEGRAM_CHAT_IDS are processed —
// anyone else who finds the bot's public username is silently ignored, so
// the bot can't be used to inject fake expenses into the ledger.
//
// No npm dependencies (this repo's package.json declares none, and
// node_modules here isn't a real install — see api/checkout.js for the
// same gap with `stripe`, not otherwise fixed by this file). Talks to
// Telegram, Anthropic, and Supabase entirely over fetch.

const crypto = require('crypto');

const CATEGORIES = ['software', 'equipment', 'insurance', 'rent', 'other'];

function verifySecret(req) {
  const provided = Buffer.from(req.headers['x-telegram-bot-api-secret-token'] || '');
  const expected = Buffer.from(process.env.TELEGRAM_WEBHOOK_SECRET || '');
  if (!expected.length || provided.length !== expected.length) return false;
  return crypto.timingSafeEqual(provided, expected);
}

async function telegramApi(method, params) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}

function sendText(chatId, text) {
  return telegramApi('sendMessage', { chat_id: chatId, text });
}

async function downloadTelegramFile(fileId) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const fileInfo = await telegramApi('getFile', { file_id: fileId });
  const filePath = fileInfo.result && fileInfo.result.file_path;
  if (!filePath) throw new Error('getFile returned no file_path');
  const res = await fetch(`https://api.telegram.org/file/bot${token}/${filePath}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const ext = (filePath.split('.').pop() || '').toLowerCase();
  const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
  return { buffer, mime };
}

async function extractReceipt(base64Image, mimeType) {
  const prompt = `You are a bookkeeping assistant extracting structured data from a photo of an expense receipt for a small creative production business (Anqor Studios, Dubai, UAE).

Extract exactly these fields:
- vendor: the business name on the receipt, as printed
- date: transaction date as YYYY-MM-DD. Never invent a date with no basis on the receipt.
- total: the final total paid, as a plain number (no currency symbol, no thousands separator)
- currency: ISO 4217 code (e.g. "AED", "USD"), inferred from symbols/context if not printed explicitly
- category: the single best match from exactly this list: ${CATEGORIES.join(', ')}. Never invent a category outside this list.
- confidence: "high" or "low" — use "low" if the image is blurry, cropped, the vendor/total can't be confidently read, or no category is a reasonable match. Never guess a plausible-looking value instead of flagging low confidence.

Return ONLY valid JSON, no other text: {"vendor":"<string>","date":"<YYYY-MM-DD>","total":<number>,"currency":"<code>","category":"<string>","confidence":"high"|"low"}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64Image } },
        ],
      }],
    }),
  });
  const data = await res.json();
  const text = data.content && data.content[0] && data.content[0].text;
  if (!text) throw new Error('vision extraction returned no text: ' + JSON.stringify(data).slice(0, 300));
  const match = text.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : text);
}

async function insertExpense(row) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  const res = await fetch(`${url}/rest/v1/expenses`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      apikey: key,
      authorization: `Bearer ${key}`,
      prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`supabase insert failed: ${res.status} ${errText}`);
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!verifySecret(req)) {
    return res.status(403).json({ error: 'invalid secret token' });
  }

  const message = (req.body || {}).message;
  if (!message) return res.status(200).json({ ok: true });

  const chatId = String((message.chat || {}).id || '');
  const authorized = (process.env.AUTHORIZED_TELEGRAM_CHAT_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (authorized.length && !authorized.includes(chatId)) {
    return res.status(200).json({ ok: true }); // silently ignore strangers
  }

  const photos = message.photo || [];
  if (!photos.length) {
    await sendText(chatId, "Send a photo of a receipt and I'll log it to the Expenses ledger.");
    return res.status(200).json({ ok: true });
  }

  const messageId = String(message.message_id);
  try {
    const largest = photos[photos.length - 1];
    const { buffer, mime } = await downloadTelegramFile(largest.file_id);
    const base64 = buffer.toString('base64');
    const extraction = await extractReceipt(base64, mime);

    const isAed = !extraction.currency || extraction.currency.toUpperCase() === 'AED';
    const knownCategory = CATEGORIES.includes(extraction.category);
    const needsReview = extraction.confidence !== 'high' || !extraction.total || !knownCategory || !isAed;

    let reviewReason = null;
    if (needsReview) {
      if (!isAed) reviewReason = `receipt is in ${extraction.currency} — confirm AED amount manually`;
      else if (extraction.confidence !== 'high') reviewReason = 'low-confidence extraction';
      else if (!extraction.total) reviewReason = 'no total amount extracted';
      else reviewReason = `category "${extraction.category}" not recognized`;
    }

    await insertExpense({
      description: extraction.vendor || 'Receipt (needs review)',
      vendor: extraction.vendor || null,
      category: knownCategory ? extraction.category : 'other',
      amount_aed: isAed ? (extraction.total || 0) : 0,
      date: extraction.date || new Date().toISOString().split('T')[0],
      recurring: false,
      needs_review: needsReview,
      review_reason: reviewReason,
      receipt_image_base64: base64,
      receipt_image_mime: mime,
      telegram_message_id: messageId,
    });

    const summary = needsReview
      ? `Logged for review (${reviewReason}) — check the Expenses page to confirm.`
      : `Logged: AED ${extraction.total} — ${extraction.vendor} (${extraction.category})`;
    await sendText(chatId, summary);
  } catch (err) {
    if (String(err.message || '').includes('duplicate key')) {
      return res.status(200).json({ ok: true }); // already processed (Telegram retried the webhook)
    }
    console.error('telegram-expense error:', err);
    await sendText(chatId, "Couldn't process that receipt — try again, or add it manually on the Expenses page.");
  }

  return res.status(200).json({ ok: true });
};
