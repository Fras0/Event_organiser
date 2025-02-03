const express = require("express");
const { protect } = require("../middlewares/protect");
const { restrictTo } = require("./../middlewares/restrictTo");

const router = express.Router({ mergeParams: true });
const {
  subscribeToEvent,
  getEventSubscribers,
  getUserEvents,
} = require("./../controllers/attendance.controller");
const { getMe } = require("../controllers/user.controller");

router.use(protect);

router.use(restrictTo("volunteer"));
router
  .route("/events/:eventId")
  .get(getEventSubscribers)
  .post(subscribeToEvent);
router.route("/users/:userId").get(getUserEvents);
router.route("/myEvents").get(getMe, getUserEvents);

module.exports = router;
