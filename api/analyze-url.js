// Vercel serverless function: scrape and classify a business URL
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.body || {};

  if (!url || typeof url !== 'string') {
    return res.status(200).json({ status: 'failed', reason: 'no_url' });
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url.startsWith('http') ? url : 'https://' + url);
  } catch {
    return res.status(200).json({ status: 'failed', reason: 'invalid_url' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(parsedUrl.href, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AnqorAssessment/1.0)',
        'Accept': 'text/html',
      },
    });
    clearTimeout(timeout);

    const html = await response.text();

    // Extract meaningful text signals
    const title = (html.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1] || '';
    const description = (html.match(/meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i) || [])[1] || '';
    const h1s = [...html.matchAll(/<h1[^>]*>([^<]+)<\/h1>/gi)].map(m => m[1]).join(' ');
    const h2s = [...html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi)].map(m => m[1]).slice(0, 5).join(' ');

    // Strip tags from a body excerpt
    const bodyText = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .slice(0, 2000);

    const signals = `Title: ${title}\nDescription: ${description}\nH1: ${h1s}\nH2: ${h2s}\nBody excerpt: ${bodyText}`;

    // Rule-based industry inference from keyword signals
    const lower = signals.toLowerCase();
    let industry = 'business';
    let size = 'unknown';

    if (/e.?commerce|shop|store|product|shopify|buy now|add to cart/i.test(lower)) industry = 'e-commerce';
    else if (/saas|software|platform|app|dashboard|free trial|sign up/i.test(lower)) industry = 'SaaS / Software';
    else if (/agency|creative|studio|design|branding|marketing agency/i.test(lower)) industry = 'Agency / Creative Studio';
    else if (/coaching|coach|consultant|consulting|advisory|strategy/i.test(lower)) industry = 'Consulting / Coaching';
    else if (/real estate|property|realtor|mortgage|listing/i.test(lower)) industry = 'Real Estate';
    else if (/health|wellness|clinic|medical|therapy|dental|doctor/i.test(lower)) industry = 'Healthcare / Wellness';
    else if (/recruit|staffing|talent|hiring|hr |human resources/i.test(lower)) industry = 'Recruitment / HR';
    else if (/finance|investment|wealth|insurance|financial/i.test(lower)) industry = 'Finance / Investment';
    else if (/restaurant|food|hospitality|hotel|catering/i.test(lower)) industry = 'Hospitality / Food';
    else if (/law|legal|attorney|solicitor|barrister/i.test(lower)) industry = 'Legal Services';
    else if (/construction|contractor|building|renovation/i.test(lower)) industry = 'Construction / Trades';

    if (/team of|our team|staff|employees|\d+ people|\d+ professionals/i.test(lower)) size = 'team';
    else if (/i am|i'm|solo|just me|founder-led|one person/i.test(lower)) size = 'solo';

    const functionalAreas = [];
    if (/sales|outreach|lead|pipeline|crm/i.test(lower)) functionalAreas.push('sales');
    if (/support|customer service|helpdesk|ticket|chat/i.test(lower)) functionalAreas.push('support');
    if (/content|blog|social|post|publish/i.test(lower)) functionalAreas.push('content');
    if (/operations|ops|process|workflow|fulfillment/i.test(lower)) functionalAreas.push('operations');
    if (/hiring|onboard|hr|recruit/i.test(lower)) functionalAreas.push('hr');

    // Generate a human-readable business summary via DeepSeek
    let businessSummary = '';
    if (process.env.DEEPSEEK_API_KEY) {
      try {
        const aiRes = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            max_tokens: 80,
            messages: [
              {
                role: 'system',
                content: 'You summarize businesses in exactly 1 sentence. Be specific. Do not use the word "I". Output only the sentence, nothing else.',
              },
              {
                role: 'user',
                content: `Summarize what this business does in one sentence:\n\n${signals.slice(0, 800)}`,
              },
            ],
          }),
        });
        const aiData = await aiRes.json();
        businessSummary = aiData.choices?.[0]?.message?.content?.trim() || '';
      } catch (_) {}
    }

    return res.status(200).json({
      status: 'success',
      domain: parsedUrl.hostname,
      industry,
      size,
      functionalAreas,
      rawSignals: signals.slice(0, 500),
      businessSummary,
    });
  } catch (err) {
    return res.status(200).json({ status: 'failed', reason: err.name === 'AbortError' ? 'timeout' : 'fetch_error' });
  }
};
