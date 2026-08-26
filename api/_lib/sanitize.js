// Third, redundant em-dash gate. Ranqr's own pipeline already enforces this
// twice (a generation-prompt instruction, plus a mechanical regex strip that
// runs unconditionally even if Ranqr's own LLM edit pass fails — see
// ranqr/content_qa.py in the Ranqr repo). This is not compensating for a
// known gap; it's this endpoint refusing to trust a remote caller, however
// solid, at its own boundary. Same replacement strategy as Ranqr's own
// strip_em_dashes(), so behavior is consistent end to end.

const EM_DASH = '—';

function stripEmDashes(text) {
  if (typeof text !== 'string') return text;
  let out = text.split(EM_DASH).join(', ');
  out = out.replace(/,\s*,/g, ',');
  out = out.replace(/\s+,/g, ',');
  out = out.replace(/[ \t]{2,}/g, ' ');
  out = out.replace(/,\s*([.!?])/g, '$1');
  return out.trim();
}

function sanitizeArticle(article) {
  return {
    ...article,
    title: stripEmDashes(article.title),
    meta_description: stripEmDashes(article.meta_description),
    body_markdown: stripEmDashes(article.body_markdown),
    faq_items: (article.faq_items || []).map((f) => ({
      question: stripEmDashes(f.question),
      answer: stripEmDashes(f.answer),
    })),
  };
}

module.exports = { stripEmDashes, sanitizeArticle };
