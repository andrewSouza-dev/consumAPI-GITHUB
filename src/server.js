const express = require("express");
const app = express();
const cors = require("cors");
const githubRoutes = require("./routes/allRoutes");
const errorHandler = require("./middlewares/errorHandler");

require("dotenv").config();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// ✅ Habilitar CORS globalmente
app.use(cors());

app.use("/", githubRoutes);

// Middleware de erro (sempre por último)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server rodando em http://localhost:${PORT}`)
);
