# 📘 GitHub Commit History – Consulta e Armazenamento de Commits

Uma aplicação web construída em Node.js + Express que consome a API pública do GitHub para buscar o histórico de commits de qualquer repositório, permitindo filtrar, paginar, visualizar e armazenar os commits em um banco de dados PostgreSQL utilizando Prisma ORM.

A interface é feita com EJS e estilizada para oferecer uma experiência intuitiva e agradável.

---

## 🚀 Funcionalidades

✔ Buscar commits de qualquer repositório público do GitHub
✔ Filtrar commits por autor
✔ Paginação personalizável (quantidade por página)
✔ Salvamento automático dos commits no banco de dados
✔ Armazenamento do repositório consultado (via upsert)
✔ Tratamento completo de erros (404, limite da API, erros internos)
✔ Interface moderna em EJS
✔ Histórico de pesquisa persistente no banco
✔ Animação de fundo e design responsivo

---

## 🧱 Tecnologias Utilizadas

Node.js

Express.js

Prisma ORM

PostgreSQL

EJS (Embedded JavaScript Templates)

Axios

CSS / animações customizadas

---

## 📦 Estrutura do Projeto

src/
 ├─ controllers/
 │   └─ githubController.js
 ├─ services/
 │   └─ githubService.js
 ├─ middlewares/
 │   └─ errorHandler.js
 ├─ error/
 │   └─ HttpError.js
 ├─ database/
 │   └─ index.js
 ├─ views/
 │   ├─ index.ejs
 │   ├─ commits.ejs
 │   ├─ partials/
 │   └─ errors/
 └─ routes/
     └─ allRoutes.js

prisma/
 └─ schema.prisma

---

## Imagens do Projeto 📸

![Tela de Inicio](src/public/images/home.png)

---

![Lista de Commits](src/public/images/commits.png)

---

![Página de Erros](src/public/images/erros.png)

---

![Tables](src/public/images/tables.png)

---

![Select](src/public/images/select.png)

---

## ⚙️ Configuração e Execução

1️⃣ Clonar o repositório
git clone git@github.com:andrewSouza-dev/consumAPI-GITHUB.git
cd consumAPI-GITHUB

2️⃣ Instalar dependências
npm install

3️⃣ Configurar variáveis de ambiente

Crie o arquivo .env na raiz:

DATABASE_URL="postgresql://usuario:senha@localhost:5432/seubanco?schema=public"
GITHUB_TOKEN="opcional_se_tiver_token"

🔹 O token do GitHub é opcional, mas recomendado para evitar limite de requisições.

4️⃣ Executar migrações do Prisma
npx prisma migrate dev

5️⃣ Iniciar o servidor
npm run dev