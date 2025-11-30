const express = require("express");
const router = express.Router();
const controller = require("../controllers/githubController");

router.get("/", controller.home);
router.get("/commits", controller.listCommits);

module.exports = router;
