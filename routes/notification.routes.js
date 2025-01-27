// backend/routes/notificationRoutes.js
const express = require("express");
const { sendNotification } = require("../controllers/notification.controller");

const router = express.Router();

let tokens = [];

router.post("/subscribe", (req, res) => {
  const { token } = req.body;
  if (token) {
    tokens.push(token); // Store token
    res.status(200).send({ success: true, message: "Token saved." });
  } else {
    res.status(400).send({ success: false, message: "Token is required." });
  }
});

router.post("/send", sendNotification);

tokens.forEach(function (entry) {
  console.log(entry);
});

module.exports = router;
