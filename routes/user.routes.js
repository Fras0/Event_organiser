const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getMe,
  deleteMe,
} = require("../controllers/user.controller");
const { protect } = require("../middlewares/protect");
const { restrictTo } = require("../middlewares/restrictTo");

router.use(protect);

router.route("/myProfile").get(getMe, getUser);
router.route("/:userId").get(getUser);
router.route("/deleteMe").delete(deleteMe);

router.use(restrictTo("admin"));
router.route("/").get(getAllUsers);
router.route("/:userId").patch(updateUser).delete(deleteUser);
module.exports = router;
