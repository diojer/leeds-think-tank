const express = require("express");
const router = express.Router();
const { Articles } = require("../models");
const ftp = require("basic-ftp");
const streamifier = require("streamifier");
const checkPerms = require("../utility/checkPerms");

require("dotenv").config();
//
const jwtSecret = process.env.SECRET ? process.env.SECRET : "jwtSECRET";

router.get("/", async (req, res) => {
  if (!req.query.id) {
    const listOfArticles = await Articles.findAll();
    res.json(listOfArticles);
  } else {
    const id = req.query.id;
    const article = await Articles.findOne({ where: { id: id } });
    res.json(article);
  }
});

router.post("/", checkPerms, async (req, res) => {
  const article = req.body;
  await Articles.create(article);
  res.json({ message: "Article Uploaded", uploaded: true });
});

router.post("/images", checkPerms, async (req, res) => {
  const images = req.files;
  const buffers = [images.bannerImage.data, images.cardImage.data];
  const streamImages = [
    streamifier.createReadStream(buffers[0]),
    streamifier.createReadStream(buffers[1]),
  ];
  streamImages[0].name = images.bannerImage.name;
  streamImages[1].name = images.cardImage.name;
  uploadImages();
  async function uploadImages() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
      await client.access({
        host: "153.92.6.186",
        port: 21,
        user: "u306888137",
        password: process.env.DB_PASSWORD
          ? process.env.DB_PASSWORD
          : "h5o7yTehl4uh5t",
        secure: false,
      });
      await client.uploadFrom(
        streamImages[0],
        `images/articles/${streamImages[0].name}`
      );
      await client.uploadFrom(
        streamImages[1],
        `images/articles/${streamImages[1].name}`
      );
    } catch (err) {
      console.log(err);
    }
    client.close();
  }
  res.json({ message: "Files Uploaded", uploaded: true });
});

module.exports = router;
