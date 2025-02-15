const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  closeEvent,
} = require("../controllers/event.controller");
const { restrictTo } = require("./../middlewares/restrictTo");
const { protect } = require("./../middlewares/protect");

router.use(protect);

router.route("/").get(getAllEvents);

router.route("/:id").get(getEvent);

router.use(restrictTo("admin"));

router.route("/").post(createEvent);
router.route("/:id").patch(updateEvent).delete(deleteEvent);
router.route("/:id/close").patch(closeEvent);
module.exports = router;
