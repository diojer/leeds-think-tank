const express = require("express");
const router = express.Router();
const { MailingList } = require("../models");

router.get("/", async (req, res) => {
  const listOfEmails = await MailingList.findAll();
  res.json(listOfEmails);
});

router.post("/", async (req, res) => {
  const mailee = req.body;
  await MailingList.create(mailee);
  res.send("Email Added");
});

module.exports = router;
