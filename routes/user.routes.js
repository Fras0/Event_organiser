const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/user.controller");
const { protect } = require("../middlewares/protect");

router.use(protect);
router.get("/", getUsers);
module.exports = router;
