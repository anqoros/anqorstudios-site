// sitemap.xml was a static, one-time-generated file that never got touched
// again after 2026-08-21 -- every blog post Ranqr published after that date
// went live and linked from /blog, but was never in the sitemap, so Google
// never discovered it there. This regenerates the sitemap as part of the
// same atomic commit as the post itself, so it can't drift out of date
// again. Every non-blog URL (home, services, industries, legal pages, the
// /blog index) is preserved byte-for-byte from whatever's already there --
// this only touches the individual /blog/{slug} entries.

const SITE = 'https://anqorstudios.com';
const BLOG_URL_RE = new RegExp(
  `<url>\\s*<loc>${SITE.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}/blog/[^<]+</loc>[\\s\\S]*?</url>\\s*`,
  'g'
);
const BLOG_INDEX_BLOCK_RE = new RegExp(
  `(<url>\\s*<loc>${SITE.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}/blog</loc>[\\s\\S]*?</url>\\s*)`
);

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function postUrlBlock(post) {
  return `  <url>
    <loc>${SITE}/blog/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
}

// currentXml: the existing sitemap.xml content (string).
// publishedPosts: full posts array (any status) newest-first, same shape as
// blog/posts.json -- only status === 'published' entries get a sitemap URL.
function regenerateSitemap(currentXml, publishedPosts) {
  const published = publishedPosts.filter((p) => p.status === 'published');
  const postBlocks = published.map(postUrlBlock).join('');

  let xml = currentXml.replace(BLOG_URL_RE, '');

  if (BLOG_INDEX_BLOCK_RE.test(xml)) {
    xml = xml.replace(BLOG_INDEX_BLOCK_RE, (indexBlock) => {
      const withFreshLastmod = indexBlock.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${todayIso()}</lastmod>`);
      return withFreshLastmod + postBlocks;
    });
  } else {
    // No /blog entry found at all (shouldn't normally happen) -- append
    // before the closing tag rather than silently dropping the posts.
    xml = xml.replace('</urlset>', `${postBlocks}</urlset>`);
  }

  return xml;
}

module.exports = { regenerateSitemap };
