require('dotenv').config();
const fetch = require('node-fetch');
const { prisma, ensureRepository } = require('./prisma');

async function syncCommits(owner, repo, opts = {}) {
  const repository = await ensureRepository(owner, repo);
  const token = process.env.GITHUB_TOKEN;
  const baseUrl = `https://api.github.com/repos/${owner}/${repo}/commits`;

  const params = new URLSearchParams();
  if (opts.since) params.set('since', opts.since);
  if (opts.until) params.set('until', opts.until);
  params.set('per_page', String(opts.per_page || 50));
  if (opts.page) params.set('page', String(opts.page));

  const url = `${baseUrl}?${params.toString()}`;
  const headers = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'github-commits-prisma',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao buscar commits: ${res.status} ${res.statusText} - ${text}`);
  }

  const commits = await res.json();

  for (const c of commits) {
    const sha = c.sha;
    const message = c.commit?.message || '';
    const authorName = c.commit?.author?.name || c.author?.login || null;
    const authorEmail = c.commit?.author?.email || null;
    const date = c.commit?.author?.date ? new Date(c.commit.author.date) : new Date();
    const urlHtml = c.html_url || `https://github.com/${owner}/${repo}/commit/${sha}`;

    await prisma.commit.upsert({
      where: { sha },
      update: {
        message,
        authorName,
        authorEmail,
        date,
        url: urlHtml,
        repositoryId: repository.id
      },
      create: {
        sha,
        message,
        authorName,
        authorEmail,
        date,
        url: urlHtml,
        repositoryId: repository.id
      }
    });
  }

  return {
    repository: repository.fullName,
    count: commits.length,
    params: Object.fromEntries(params.entries())
  };
}

async function listCommits(filters = {}) {
  const where = {};
  if (filters.repoFullName) {
    where.repository = { fullName: filters.repoFullName };
  }
  if (filters.authorName) {
    where.authorName = { contains: filters.authorName, mode: 'insensitive' };
  }
  if (filters.since || filters.until) {
    where.date = {};
    if (filters.since) where.date.gte = new Date(filters.since);
    if (filters.until) where.date.lte = new Date(filters.until);
  }

  const take = Number(filters.take || 50);
  const skip = Number(filters.skip || 0);

  return prisma.commit.findMany({
    where,
    orderBy: { date: 'desc' },
    take,
    skip,
    include: { repository: true }
  });
}

async function listRepositories() {
  return prisma.repository.findMany({
    include: { _count: { select: { commits: true } } },
    orderBy: { updatedAt: 'desc' }
  });
}

module.exports = { syncCommits, listCommits, listRepositories };
