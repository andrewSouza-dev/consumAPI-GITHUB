const httpError = require("../error/HttpError");
const { prisma } = require("../database");
const { fetchCommits } = require("../services/githubService");


// HOME 
async function home(req, res) {
  res.render("index");
}


// LISTAR COMMITS
async function listCommits(req, res, next) {
  try {
    const { user, repo, page = 1, per_page = 10, author } = req.query;

    if (!user || !repo) {
      return next(httpError(404, "Usuário ou repositório não encontrado!"));
    }

    const pageNum = parseInt(page);
    const perPageNum = parseInt(per_page);

    const commits = await fetchCommits(user, repo, pageNum, perPageNum);

    // Salva o repositório no banco se ainda não existir
    await prisma.repository.upsert({
      where: { fullName: `${user}/${repo}` },
      update: {},
      create: {
        owner: user,
        name: repo,
        fullName: `${user}/${repo}`
      }
    });

    // Salva commits no banco
    for (const c of commits) {
      await prisma.commit.upsert({
        where: { sha: c.sha },
        update: {},
        create: {
          sha: c.sha,
          message: c.message,
          author: c.author,
          date: new Date(c.date),
          repo: `${user}/${repo}`
        }
      });
    }

    const filters = {
      repo: `${user}/${repo}`,
      ...(author && {
        author: { contains: author, mode: "insensitive" }
      })
    };

    const results = await prisma.commit.findMany({
      where: filters,
      skip: (pageNum - 1) * perPageNum,
      take: perPageNum,
      orderBy: { date: "desc" }
    });

    res.render("commits", {
      commits: results,
      page: pageNum,
      per_page: perPageNum,
      user,
      repo,
      author: author || ""
    });

  } catch (err) {
    next(err);
  }
}

module.exports = {
  home,
  listCommits
};
