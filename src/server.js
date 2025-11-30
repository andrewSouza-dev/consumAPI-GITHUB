require("dotenv").config();
const express = require("express");
const app = express();
const githubRoutes = require("./routes/allRoutes");

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.urlencoded({ extended: true }));
app.use("/", githubRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
