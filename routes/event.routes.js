const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  subscribeToEvent,
} = require("../controllers/event.controller");
const { restrictTo } = require("./../middlewares/restrictTo");
const { protect } = require("./../middlewares/protect");

router.use(protect);
router.route("/").get(getAllEvents).post(restrictTo("admin"), createEvent);

router.route("/:id").get(getEvent);

router.use(restrictTo("volunteer"));
router.route("/:id/subscribe").post(subscribeToEvent);

router.use(restrictTo("admin"));
router.route("/:id").patch(updateEvent).delete(deleteEvent);

module.exports = router;
