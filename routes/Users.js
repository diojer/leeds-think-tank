const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  const listOfUsers = await Users.findAll();
  res.json(listOfUsers);
});

router.post("/login", async (req, res) => {
  const { username, password, remember } = req.body;
  const user = await Users.findOne({ where: { username: username } });
  if (!user) {
    res.json({
      message: "Username incorrect",
      valid: false,
    });
    return;
  }
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      res.json({
        message: err,
        valid: false,
      });
      return;
    }
    if (result) {
      res.json({
        message: "Login successful",
        valid: true,
      });
    } else {
      res.json({
        message: "Password incorrect",
        valid: false,
      });
    }
  });
});

router.post("/", async (req, res) => {
  const { username, password, email } = req.body;
  const existingUser = await Users.findOne({ where: { username: username } });
  const existingEmail = await Users.findOne({ where: { email: email } });
  if (existingUser) {
    res.json({
      message: "Username already exists",
      valid: false,
    });
    return;
  }
  if (existingEmail) {
    res.json({ message: "Email already in use", valid: false });
    return;
  }
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
      email: email,
    });
    res.send({ message: "Registered Successfully", valid: true });
  });
});

module.exports = router;
