// Receiving endpoint for Ranqr's generic "custom_api" publisher
// (ranqr/publishers/custom_api.py in the Ranqr repo — this implementation
// was built by reading that connector's actual code, not just the protocol
// description, so the shapes below match it exactly).
//
// GET  -> connection test: 200 {"connected": true} if the bearer token
//         matches, 401 otherwise.
// POST -> publish an article: validates the token and body, strips any
//         em dash that survived Ranqr's own two upstream gates (belt and
//         suspenders, not a fix for a known gap — see sanitize.js), converts
//         the markdown body to the site's article HTML, builds the post
//         page and an updated blog index from the site's real, live nav and
//         CSS (see template.js), and commits both plus an updated
//         blog/posts.json to this repo in one atomic multi-file commit via
//         GitHub's Git Data API. Vercel then deploys the new commit the
//         same way every other change to this site ships — expect roughly
//         30-90 seconds between this endpoint returning and the page being
//         live, not an instant publish.
//
// Auth is a long random API key compared against RANQR_API_KEY, using a
// timing-safe comparison so response time can't leak how many leading
// characters of a guess were correct.

const crypto = require('crypto');
const { markdownToHtml } = require('./_lib/markdown');
const { sanitizeArticle } = require('./_lib/sanitize');
const { slugify, uniqueSlug, buildPostPage, buildIndexPage, readTimeFor } = require('./_lib/blog-builder');
const { commitFiles, readFile } = require('./_lib/github');

function checkAuth(req) {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return false;

  const provided = Buffer.from(match[1]);
  const expected = Buffer.from(process.env.RANQR_API_KEY || '');
  if (provided.length !== expected.length) return false;
  return crypto.timingSafeEqual(provided, expected);
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function categoryFromTitle() {
  // Ranqr's protocol doesn't send a category. Every post lands under one
  // consistent label rather than guessing a taxonomy from the title.
  return 'From Ranqr';
}

module.exports = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ detail: 'Method not allowed' });
  }

  if (!checkAuth(req)) {
    return res.status(401).json({ detail: 'Invalid or missing API key' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ connected: true });
  }

  // POST — publish
  try {
    const body = req.body || {};
    const { title, meta_description: metaDescription, body_markdown: bodyMarkdown } = body;
    const status = body.status === 'draft' ? 'draft' : 'published';

    if (!title || !metaDescription || !bodyMarkdown) {
      return res.status(400).json({ detail: 'title, meta_description and body_markdown are required' });
    }

    const sanitized = sanitizeArticle({
      title,
      meta_description: metaDescription,
      body_markdown: bodyMarkdown,
      faq_items: Array.isArray(body.faq_items) ? body.faq_items : [],
    });

    const existingRaw = await readFile('blog/posts.json');
    const existingPosts = existingRaw ? JSON.parse(existingRaw) : [];
    const existingSlugs = new Set(existingPosts.map((p) => p.slug));

    const desiredSlug = body.slug && String(body.slug).trim() ? body.slug : sanitized.title;
    const slug = uniqueSlug(desiredSlug, existingSlugs);

    const bodyHtml = markdownToHtml(sanitized.body_markdown);
    const wordCount = sanitized.body_markdown.split(/\s+/).filter(Boolean).length;

    const newPost = {
      slug,
      title: sanitized.title,
      meta_description: sanitized.meta_description,
      date: todayIso(),
      cat: categoryFromTitle(),
      read: readTimeFor(wordCount),
      dek: sanitized.meta_description,
      body_html: bodyHtml,
      faq_items: sanitized.faq_items,
      status,
      source: 'ranqr',
      author: 'Ranqr',
    };

    const updatedPosts = [newPost, ...existingPosts];

    const related = existingPosts
      .filter((p) => p.status === 'published')
      .slice(0, 3)
      .map((p) => ({ slug: p.slug, title: p.title }));

    const postHtml = buildPostPage(newPost, related);
    const indexHtml = buildIndexPage(updatedPosts);

    const publishedUrl =
      status === 'published'
        ? `https://anqorstudios.com/blog/${slug}`
        : `https://anqorstudios.com/blog/${slug}.html?preview=1`;

    await commitFiles(
      [
        { path: `blog/${slug}.html`, content: postHtml },
        { path: 'blog/index.html', content: indexHtml },
        { path: 'blog/posts.json', content: JSON.stringify(updatedPosts, null, 2) },
      ],
      `Ranqr: publish "${newPost.title}" (${status})`
    );

    return res.status(201).json({
      published_url: publishedUrl,
      status,
      id: slug,
    });
  } catch (err) {
    console.error('ranqr-publish error:', err.message);
    return res.status(500).json({ detail: 'Internal error publishing article' });
  }
};
