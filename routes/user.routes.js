const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/user.controller");
const { protect } = require("../middlewares/protect");

router.get("/", protect, getUsers);
module.exports = router;
