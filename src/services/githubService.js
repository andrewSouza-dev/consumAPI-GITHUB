const axios = require("axios");

/**
 * Busca commits da API do GitHub
 */
async function fetchCommits(user, repo, page = 1, per_page = 10) {
  const url = `https://api.github.com/repos/${user}/${repo}/commits`;

  const response = await axios.get(url, {
    params: { per_page, page },
    headers: {
      Authorization: process.env.GITHUB_TOKEN
        ? `token ${process.env.GITHUB_TOKEN}`
        : undefined
    }
  });

  // Normaliza os dados
  return response.data.map((c) => ({
    sha: c.sha,
    message: c.commit.message,
    author: c.commit.author.name,
    date: c.commit.author.date
  }));
}

module.exports = { fetchCommits };
