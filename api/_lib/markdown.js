// Deliberately narrow markdown -> HTML converter, not a general CommonMark
// implementation. Ranqr's content_engine.py prompt spec (see that repo)
// asks for exactly: ## / ### headings, paragraphs, bullet lists, and
// **bold**/*italic* inline emphasis. A hand-rolled converter that only
// understands that subset is more predictable here than a general-purpose
// library that might emit a different HTML shape than the site's fixed CSS
// (.post-body h2/p/ul) expects.

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function inline(text) {
  let out = escapeHtml(text);
  out = out.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  out = out.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, label, href) => {
    const safeHref = /^https?:\/\//.test(href) ? href : '#';
    return `<a href="${escapeHtml(safeHref)}" target="_blank" rel="noopener">${label}</a>`;
  });
  return out;
}

function markdownToHtml(md) {
  const lines = String(md || '').replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let listBuffer = [];

  function flushList() {
    if (listBuffer.length) {
      out.push(`<ul>${listBuffer.map((li) => `<li>${inline(li)}</li>`).join('')}</ul>`);
      listBuffer = [];
    }
  }

  let paraBuffer = [];
  function flushPara() {
    if (paraBuffer.length) {
      out.push(`<p>${inline(paraBuffer.join(' '))}</p>`);
      paraBuffer = [];
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    const h3 = line.match(/^###\s+(.*)$/);
    if (h3) {
      flushPara();
      flushList();
      out.push(`<h3>${inline(h3[1])}</h3>`);
      continue;
    }
    const h2 = line.match(/^##\s+(.*)$/);
    if (h2) {
      flushPara();
      flushList();
      out.push(`<h2>${inline(h2[1])}</h2>`);
      continue;
    }
    const h1 = line.match(/^#\s+(.*)$/);
    if (h1) {
      // Body markdown shouldn't carry an H1 (the page template renders its
      // own from `title`), but degrade gracefully to H2 rather than drop it.
      flushPara();
      flushList();
      out.push(`<h2>${inline(h1[1])}</h2>`);
      continue;
    }
    const li = line.match(/^[-*]\s+(.*)$/);
    if (li) {
      flushPara();
      listBuffer.push(li[1]);
      continue;
    }
    flushList();
    paraBuffer.push(line);
  }
  flushPara();
  flushList();

  return out.join('');
}

module.exports = { markdownToHtml, inline, escapeHtml };
