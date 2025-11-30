const prisma = require("../database");
const { fetchCommits } = require("../services/github.service");

module.exports = {
  async listCommits(req, res) {
    try {
      const { user, repo, page = 1, per_page = 10, author } = req.query;

      if (!user || !repo)
        return res.status(400).send("Missing user or repo");

      // Buscar commits da API
      const commits = await fetchCommits(user, repo, page, per_page);

      // Salvar no banco (ignorar duplicados)
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

      // Buscar do banco com filtros (opcional)
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
      console.error(err);
      res.status(500).send("Error fetching commits");
    }
  },

  async home(req, res) {
    res.render("index");
  }
};
