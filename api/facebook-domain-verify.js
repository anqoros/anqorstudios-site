// Serves the Facebook Business domain-verification code directly, bypassing
// vercel.json's cleanUrls, which 308-redirects a static
// ue4lley9dvtqd29ajwykwi53xor27z.html to its extension-less path -- fine for
// a browser, but Facebook's verifier checks the exact .html URL and doesn't
// follow that redirect, so verification failed until this existed. A
// rewrite in vercel.json points the exact verification URL here instead of
// at the static file.
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.status(200).send('ue4lley9dvtqd29ajwykwi53xor27z');
};
