require("dotenv").config();
const express = require("express");
const app = express();
const githubRoutes = require("./routes/allRoutes");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({ extended: true }));
app.use("/", githubRoutes);

const PORT = process.env.PORT || 3000

app.listen(PORT, () =>
  console.log(`Server rodando em http://localhost:${PORT}`)
);
