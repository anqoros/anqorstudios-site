const {
  SITE, ORG_ID, SITE_ID, PERSON_ID,
  orgSchemaNodes, headBlock, escAttr, NAV_HTML, FOOTER_AND_SCRIPTS,
} = require('./template');

function slugify(input) {
  return String(input)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function uniqueSlug(desired, existingSlugs) {
  let slug = slugify(desired) || 'article';
  if (!existingSlugs.has(slug)) return slug;
  let n = 2;
  while (existingSlugs.has(`${slug}-${n}`)) n += 1;
  return `${slug}-${n}`;
}

function faqBlockHtml(faqItems) {
  if (!faqItems || !faqItems.length) return '';
  const items = faqItems
    .map((f) => `<details class="faq-item"><summary>${escAttr(f.question)}</summary><p>${escAttr(f.answer)}</p></details>`)
    .join('');
  return `<div class="faq-list">${items}</div>`;
}

function faqSchemaNode(url, faqItems) {
  if (!faqItems || !faqItems.length) return null;
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

function readTimeFor(wordCount) {
  const minutes = Math.max(1, Math.round(wordCount / 220));
  return `${minutes} min`;
}

// post: { slug, title, meta_description, body_html, faq_items, date, cat, read, dek, status }
// related: array of up to 3 other post summaries { slug, title }
function buildPostPage(post, related) {
  const url = `${SITE}/blog/${post.slug}`;
  const canonicalUrl = post.status === 'draft' ? `${url}?preview=1` : url;
  const title = `${post.title} | Anqor Studios`;

  const schemaGraph = [...orgSchemaNodes()];
  schemaGraph.push({
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title },
    ],
  });
  schemaGraph.push({
    '@type': 'BlogPosting',
    '@id': `${url}#post`,
    url,
    headline: post.title,
    description: post.meta_description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Person', '@id': PERSON_ID },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': SITE_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${url}#webpage` },
    articleSection: post.cat,
    image: `${SITE}/anqor_og_image.png`,
  });
  const faqNode = faqSchemaNode(url, post.faq_items);
  if (faqNode) schemaGraph.push(faqNode);

  const head = headBlock({
    title, metaDescription: post.meta_description, canonicalUrl, schemaGraph,
    noindex: post.status === 'draft',
  });

  const crumbs = `<div class="crumbs"><a href="../index.html">Home</a><i>/</i><a href="index.html">Blog</a><i>/</i>${escAttr(post.cat)}</div>`;

  const relatedHtml = (related || [])
    .map((r) => `<a href="${r.slug}.html">${escAttr(r.title)}</a>`)
    .join('');

  const faqHtml = faqBlockHtml(post.faq_items);

  const body = `${crumbs}
<div class="hero"><div class="hero-inner post">
  <div class="post-head" style="border:0;padding:0;margin:0">
    <div class="bl-meta"><span class="cat">${escAttr(post.cat)}</span>
      <span>${escAttr(post.date)}</span><span>${escAttr(post.read)} read</span></div>
    <h1>${escAttr(post.title)}</h1>
    <p class="lede">${escAttr(post.dek)}</p>
  </div>
</div></div>

<section>
  <div class="post-body">${post.body_html}</div>
  ${faqHtml ? `<h2 style="margin-top:56px;">Questions</h2>${faqHtml}` : ''}
  ${relatedHtml ? `<div class="post-more"><div class="lbl">More from the blog</div>${relatedHtml}</div>` : ''}
</section>

<div class="cta-band"><div class="inner">
  <h2>Working on something like this?</h2>
  <p>The first conversation is diagnostic rather than a pitch. If an off-the-shelf tool would serve you better
than a build, we will say so.</p>
  <div class="cta-row">
    <a class="btn-primary" href="https://calendar.app.google/97YReFJgPs6gNFLt7" target="_blank" rel="noopener">Book a Call</a>
    <a class="btn-ghost" href="../contact.html">Contact us</a>
  </div>
</div></div>
${FOOTER_AND_SCRIPTS}`;

  return head + body;
}

function buildIndexPage(posts) {
  const url = `${SITE}/blog`;
  const title = 'Blog | AI Systems, Automation and Compliance in the UAE | Anqor Studios';
  const metaDescription =
    'Notes from Anqor Studios on building AI systems that survive production: UAE e-invoicing, AI search visibility, why pilots fail, and when to build instead of subscribe.';

  const published = posts.filter((p) => p.status === 'published');

  const schemaGraph = [...orgSchemaNodes()];
  schemaGraph.push({
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Blog' },
    ],
  });
  schemaGraph.push({
    '@type': 'Blog',
    '@id': `${url}#blog`,
    url,
    name: 'Anqor Studios Blog',
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': SITE_ID },
    blogPost: published.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE}/blog/${p.slug}`,
      datePublished: p.date,
      description: p.meta_description,
      author: { '@type': 'Person', '@id': PERSON_ID },
    })),
  });
  schemaGraph.push({
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    url,
    name: 'Blog | Anqor Studios',
    isPartOf: { '@id': SITE_ID },
    breadcrumb: { '@id': `${url}#breadcrumb` },
  });

  const head = headBlock({ title, metaDescription, canonicalUrl: url, schemaGraph });

  const items = published
    .map(
      (p) => `<a class="bl-item" href="${p.slug}.html">
    <div class="bl-meta"><span class="cat">${escAttr(p.cat)}</span>
    <span>${escAttr(p.date)}</span><span>${escAttr(p.read)} read</span></div>
    <h2>${escAttr(p.title)}</h2><p>${escAttr(p.dek)}</p>
    <span class="bl-go">Read this &rarr;</span></a>`
    )
    .join('');

  const body = `<div class="crumbs"><a href="../index.html">Home</a><i>/</i>Blog</div>
<div class="hero"><div class="hero-inner">
  <div class="eyebrow">Blog</div>
  <h1>Notes from building the things we sell.</h1>
  <p class="lede">Written for operators rather than for search engines. Mostly what went wrong, what it cost,
and what we would do differently, on subjects we have actually shipped.</p>
</div></div>

<section>
  <div class="eyebrow">Writing</div>
  <h2>Every post here is something we ran into ourselves.</h2>
  <div class="bl-list">${items}</div>
</section>

<div class="cta-band"><div class="inner">
  <h2>Got a problem that belongs in one of these?</h2>
  <p>Thirty minutes, diagnostic, no charge. Bring the problem and we will tell you honestly whether it is worth
building something for.</p>
  <div class="cta-row">
    <a class="btn-primary" href="https://calendar.app.google/97YReFJgPs6gNFLt7" target="_blank" rel="noopener">Book a Call</a>
    <a class="btn-ghost" href="../contact.html">Contact us</a>
  </div>
</div></div>
${FOOTER_AND_SCRIPTS}`;

  return head + body;
}

module.exports = { slugify, uniqueSlug, buildPostPage, buildIndexPage, readTimeFor };
