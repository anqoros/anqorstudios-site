// Minimal wrapper around GitHub's Git Data API for one atomic multi-file
// commit. The Contents API (repeated PUT /contents/{path} calls) would work
// too, but it's one HTTP request per file with no shared transaction — a
// crash or timeout partway through would leave the new post's HTML file
// committed with a stale, not-yet-updated blog index, or vice versa. This
// repo has no one watching it publish overnight, so partial-failure states
// need to not exist rather than need to be cleaned up after the fact.
//
// Flow: read the branch's current commit -> read its tree -> create a blob
// per changed file -> create one new tree layering those blobs onto the old
// one -> create one commit against that tree -> fast-forward the branch ref.
// Either the whole set of files lands, or none of it does.

const GITHUB_API = 'https://api.github.com';

function env(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

async function gh(path, options = {}) {
  const token = env('RANQR_GITHUB_TOKEN');
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API ${options.method || 'GET'} ${path} failed (${res.status}): ${body.slice(0, 500)}`);
  }
  return res.json();
}

// files: [{ path: 'blog/foo.html', content: '<html>...' }, ...]
async function commitFiles(files, message) {
  const owner = env('RANQR_GITHUB_OWNER');
  const repo = env('RANQR_GITHUB_REPO');
  const branch = process.env.RANQR_GITHUB_BRANCH || 'main';

  const refData = await gh(`/repos/${owner}/${repo}/git/ref/heads/${branch}`);
  const baseCommitSha = refData.object.sha;

  const baseCommit = await gh(`/repos/${owner}/${repo}/git/commits/${baseCommitSha}`);
  const baseTreeSha = baseCommit.tree.sha;

  const treeEntries = [];
  for (const file of files) {
    const blob = await gh(`/repos/${owner}/${repo}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify({ content: file.content, encoding: 'utf-8' }),
    });
    treeEntries.push({ path: file.path, mode: '100644', type: 'blob', sha: blob.sha });
  }

  const newTree = await gh(`/repos/${owner}/${repo}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: baseTreeSha, tree: treeEntries }),
  });

  const newCommit = await gh(`/repos/${owner}/${repo}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message,
      tree: newTree.sha,
      parents: [baseCommitSha],
    }),
  });

  await gh(`/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: newCommit.sha }),
  });

  return { commitSha: newCommit.sha };
}

// Reads a file's current content at the branch head. Returns null if it
// doesn't exist yet (a fresh repo with no blog/posts.json, for instance).
async function readFile(path) {
  const owner = env('RANQR_GITHUB_OWNER');
  const repo = env('RANQR_GITHUB_REPO');
  const branch = process.env.RANQR_GITHUB_BRANCH || 'main';

  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    { headers: { Authorization: `Bearer ${env('RANQR_GITHUB_TOKEN')}`, Accept: 'application/vnd.github+json' } }
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API GET /contents/${path} failed (${res.status}): ${body.slice(0, 500)}`);
  }
  const data = await res.json();
  return Buffer.from(data.content, 'base64').toString('utf-8');
}

module.exports = { commitFiles, readFile };
