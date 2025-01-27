const express = require("express");
const router = express.Router();
const {
  signUp,
  login,
  logout,
  refreshToken,
} = require("../controllers/auth.controller");

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refreshToken", refreshToken);

module.exports = router;
