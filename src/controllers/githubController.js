const { prisma } = require("../database");
const { fetchCommits } = require("../services/githubService");

/**
 * Controller para listar commits
 */
async function listCommits(req, res, next) {
  try {
    const { user, repo, page = 1, per_page = 10, author } = req.query;

    if (!user || !repo) {
      const error = new Error("Usuário ou repositório não encontrado!");
      error.status = 404;
      throw error;
    }

    // Buscar commits da API
    const commits = await fetchCommits(user, repo, page, per_page);

    // Persistir no banco (upsert evita duplicados)
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

    // Query com filtros
    const query = {
      where: {
        repo: `${user}/${repo}`,
        author: author ? { contains: author, mode: "insensitive" } : undefined
      },
      skip: (page - 1) * per_page,
      take: parseInt(per_page),
      orderBy: { date: "desc" }
    };

    const results = await prisma.commit.findMany(query);

    res.render("commits", {
      commits: results,
      page: +page,
      per_page: +per_page,
      user,
      repo,
      author: author || ""
    });
  } catch (err) {
    next(err); // passa para o middleware de erro
  }
}

/**
 * Controller para página inicial
 */
function home(req, res) {
  res.render("index", { title: "GitHub Commit History" });
}

module.exports = { listCommits, home };
