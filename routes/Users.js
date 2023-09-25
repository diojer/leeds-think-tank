const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const session = require("express-session");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSecret = process.env.SECRET ? process.env.SECRET : "jwtSECRET";

router.get("/", async (req, res) => {
  const listOfUsers = await Users.findAll();
  res.json(listOfUsers);
});

router.get("/login", async (req, res) => {
  if (req.session.user) {
    res.json({
      login: true,
      username: req.session.user.username,
      role: req.session.user.role,
    });
  } else if (req.cookies.rememberMe) {
    var cookie = req.cookies.rememberMe;
    req.session.user = { token: cookie };
    res.json({ remembered: true });
  }
});

router.get("/permissions", async (req, res) => {
  if (req.session.user) {
    const user = req.session.user;
    const decode = jwt.verify(user.token, jwtSecret);
    var admin = false;
    if (decode.role === "admin") {
      admin = true;
    }
    res.json({
      message: decode.role,
      valid: true,
      admin: admin,
    });
  } else {
    res.json({
      message: "No user session found",
      valid: false,
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
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        jwtSecret,
        {
          expiresIn: "30 days", //token will only EVER last 30 days
        }
      );
      req.session.user = { token: token }; //sets the session token
      //following creates a cookie which contains the JWT. Whenever the webpage is reloaded, this cookie will get set as the session cookie.
      if (remember) {
        res.cookie("rememberMe", token, {
          maxAge: 1000 * 60 * 60 * 24 * 30, //1 month
          httpOnly: true,
        });
      }
      res.json({
        message: "Login successful",
        valid: true,
        token: token,
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
