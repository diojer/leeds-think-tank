const jwt = require("jsonwebtoken");
const session = require("express-session");
require("dotenv").config();
//
const jwtSecret = process.env.SECRET ? process.env.SECRET : "jwtSECRET";

const checkPerms = (req, res, next) => {
  if (!req.session.user) {
    res.json({ message: "Access Denied", err: 403, access: false });
    req.connection.destroy();
  }
  const user = req.session.user;
  const decode = jwt.verify(user.token, jwtSecret);
  if (decode.role === "admin") {
    next();
  } else {
    res.json({ message: "Access Denied", err: 403, access: false });
    req.connection.destroy();
  }
};

module.exports = checkPerms;
