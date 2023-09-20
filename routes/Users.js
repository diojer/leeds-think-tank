const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const session = require("express-session");

// router.get("/", async (req, res) => {
//   const listOfUsers = await Users.findAll();
//   res.json(listOfUsers);
// });

router.get("/login", async (req, res) => {
  if (req.session.user) {
    res.json({
      login: true,
      username: req.session.user.username,
      role: req.session.user.role,
    });
  }
});

router.post("/login", async (req, res) => {
  const { username, password, remember } = req.body;
  const user = await Users.findOne({ where: { username: username } });
  if (!user) {
    res.json({
      message: "Username does not exist",
      valid: false,
    });
    return;
  }
  bcrypt.compare(password, user.password, (err, response) => {
    if (err) {
      res.json({
        message: err,
        valid: false,
      });
      return;
    }
    if (response) {
      req.session.user = { username: user.username, role: user.role };
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
