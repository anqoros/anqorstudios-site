// Vercel serverless function: LLM synthesis of assessment answers
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { siteContext, persona, answers } = req.body || {};

  if (!persona || !answers) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const personaLabel = persona === 'solo' ? 'solo operator / founder' : 'CEO or team leader';

  const siteBlock = siteContext?.status === 'success'
    ? `Business website: ${siteContext.domain}
Industry inferred: ${siteContext.industry}
Apparent size: ${siteContext.size}
Functional areas visible: ${(siteContext.functionalAreas || []).join(', ') || 'not detected'}
Site signals: ${siteContext.rawSignals || ''}`
    : 'No website data available (URL not provided or scrape failed).';

  const answersBlock = Object.entries(answers)
    .map(([q, a]) => `${q}: ${a}`)
    .join('\n');

  const systemPrompt = `You are a senior AI automation strategist at Anqor Studios — an AI systems studio based in Dubai that builds custom automation for high-ticket service businesses. You are direct, precise, and strategic. You do not give generic advice.

Using the business context and assessment answers provided, you will identify exactly 3 automation opportunities that would create the fastest, most visible leverage for this specific business. Each opportunity must be concrete — tied directly to the pains, industry, and answers the person gave. Do not invent problems they didn't mention.

Output ONLY valid JSON in this exact structure, nothing else before or after:
{
  "summary": "2–3 sentence overview of their current situation and the key risk if they don't act. Reference their specific answers.",
  "opportunities": [
    {
      "title": "Concise opportunity title (5–8 words)",
      "description": "2–3 sentences. Be specific to their situation. Reference what they said.",
      "impact": "Short phrase (e.g. 'Save 8–12 hours/week' or 'Convert 30% more leads')"
    },
    {
      "title": "...",
      "description": "...",
      "impact": "..."
    },
    {
      "title": "...",
      "description": "...",
      "impact": "..."
    }
  ]
}`;

  const userMessage = `Persona: ${personaLabel}

${siteBlock}

Assessment answers:
${answersBlock}

Output the JSON analysis now.`;

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 1024,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      }),
    });

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const parsed = JSON.parse(jsonMatch[0]);
    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Synthesis error:', err.message);
    // Fallback response so the UX never breaks
    return res.status(200).json({
      summary: "Based on your answers, you're leaving significant time and revenue on the table through manual processes. The good news: these are exactly the kinds of gaps AI automation is built to close.",
      opportunities: [
        {
          title: "Automate Your Client Intake & Qualification",
          description: "Replace manual back-and-forth with an AI-driven intake system that qualifies leads, collects context, and routes them — before you ever speak to them.",
          impact: "Save 5–8 hours/week on admin"
        },
        {
          title: "AI-Powered Follow-Up & Nurture System",
          description: "Deploy an always-on outreach system that follows up with leads, sends proposals, and books calls — without you touching it.",
          impact: "2–3x more booked calls"
        },
        {
          title: "Operations & Reporting on Autopilot",
          description: "Automate your weekly reporting, status updates, and internal workflows so your team focuses on delivery, not coordination.",
          impact: "Eliminate 6+ hours of overhead weekly"
        }
      ]
    });
  }
};
