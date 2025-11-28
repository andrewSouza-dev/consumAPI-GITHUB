const { syncCommits, listCommits, listRepositories } = require('../github');

function status(req, res) {
  res.json({
    status: 'ok',
    service: 'github-commits-prisma',
    endpoints: ['/sync-commits', '/commits', '/repositories']
  });
}

async function syncCommitsController(req, res) {
  try {
    const owner = req.body.owner || process.env.GITHUB_OWNER;
    const repo = req.body.repo || process.env.GITHUB_REPO;

    if (!owner || !repo) {
      return res.status(400).json({
        error: 'Informe owner e repo no body ou defina GITHUB_OWNER e GITHUB_REPO no .env'
      });
    }

    const { since, until, per_page, page } = req.body;
    const result = await syncCommits(owner, repo, { since, until, per_page, page });

    res.json({ message: 'Sincronização concluída', ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listCommitsController(req, res) {
  try {
    const { repoFullName, authorName, since, until, take, skip } = req.query;
    const filters = { repoFullName, authorName, since, until, take, skip };
    const commits = await listCommits(filters);
    res.json(commits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listRepositoriesController(req, res) {
  try {
    const repos = await listRepositories();
    res.json(repos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  status,
  syncCommitsController,
  listCommitsController,
  listRepositoriesController
};
