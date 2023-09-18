const express = require("express");
const router = express.Router();
const { Articles } = require("../models");

router.get("/", async (req, res) => {
  const listOfArticles = await Articles.findAll();
  res.json(listOfArticles);
});

router.post("/", async (req, res) => {
  const article = req.body;
  await Articles.create(article);
  res.send("Article Uploaded");
});

module.exports = router;
