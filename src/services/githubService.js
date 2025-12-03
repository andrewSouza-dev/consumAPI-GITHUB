const axios = require("axios");
const { httpError } = require("../error/HttpError");

async function fetchCommits(user, repo, page = 1, per_page = 10) {
  const url = `https://api.github.com/repos/${user}/${repo}/commits`;

  try {
    const response = await axios.get(url, {
      params: { per_page, page },
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `token ${process.env.GITHUB_TOKEN}`
        })
      }
    });

    return response.data.map((c) => ({
      sha: c.sha,
      message: c.commit.message,
      author: c.commit.author.name,
      date: c.commit.author.date
    }));

  } catch (error) {
    const status = error.response?.status;

    // 404 — usuário ou repositório não existem
    if (status === 404) {
      throw httpError(404, "Usuário ou repositório não encontrado no GitHub.");
    }

    // 403 — limite de requisições
    if (status === 403) {
      throw httpError(500, "Limite de requisições excedido na API do GitHub.");
    }

    // Erro inesperado
    throw httpError(500, "Falha ao buscar commits na API do GitHub.");
  }
}

module.exports = { fetchCommits };
