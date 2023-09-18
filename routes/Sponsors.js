const express = require("express");
const router = express.Router();
const { Sponsors } = require("../models");

router.get("/", async (req, res) => {
  const listOfSponsors = await Sponsors.findAll();
  res.json(listOfSponsors);
});

router.post("/", async (req, res) => {
  const sponsor = req.body;
  await Sponsors.create(sponsor);
  res.send("Sponsor Added");
});

module.exports = router;
