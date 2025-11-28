require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function ensureRepository(owner, name) {
  const fullName = `${owner}/${name}`;
  let repo = await prisma.repository.findUnique({ where: { fullName } });

  if (!repo) {
    repo = await prisma.repository.create({
      data: { owner, name, fullName }
    });
  }

  return repo;
}

module.exports = { prisma, ensureRepository };
