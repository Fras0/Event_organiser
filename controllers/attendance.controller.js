const Event = require("../models/event.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/app.error");
const Attendance = require("../models/attendance.model");

// ######################################### SUBSCRIBE TO EVENT #########################################
exports.subscribeToEvent = catchAsync(async (req, res, next) => {
  // 1) CHECK IF THE EVENT WITH REQ.PARAMS.ID EXISTS
  const eventId = req.params.eventId;
  const userId = req.user._id;
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError("There is no event with that id", 404));
  }
  // 2) CHECK IF THE USER IS ALREADY A VOLUNTEER IN THIS EVENT
  const existingAttendance = await Attendance.findOne({
    user: userId,
    event: eventId,
  });
  if (existingAttendance) {
    return next(
      new AppError("This user already subscribed to this event", 400)
    );
  }
  // 3) ADD THE NEW ATTENDANCE
  const newAttendance = await Attendance.create({
    event: eventId,
    user: userId,
  });
  return res.status(201).json({
    status: "success",
    data: newAttendance,
  });
});

// ######################################### GET EVENTS SUBSCRIBED BY USER #########################################
exports.unsubscribeToEvent = catchAsync(async (req, res, next) => {
  // 1) CHECK IF THERE IS SUBSCRIPTION FOR THIS USER
  const userId = req.params.userId;
  const subscription = await Attendance.findOneAndDelete({
    user: userId,
    event: req.params.eventId,
  });
  if (!subscription) {
    return next(new AppError("You are not subscribed to this event", 404));
  }
  // 2) RETURN ALL SUBSCRIPTIONS
  return res.status(204).json({
    status: "success",
    data: null,
  });
});

// ######################################### GET SUBSCRIBERS FOR EVENT #########################################
exports.getEventSubscribers = catchAsync(async (req, res, next) => {
  // 1) CHECK IF THERE IS SUBSCRIPTION FOR THIS EVENT
  const eventId = req.params.eventId;
  const subscriptions = await Attendance.find({ event: eventId })
    // .populate("user", "_id name email phone")
    .populate("user", "-__v -createdAt -updatedAt ")
    .select("-__v -_id -event")
    .exec();
  if (!subscriptions.length) {
    return next(new AppError("No subscriptions found for this event", 404));
  }
  // 2) RETURN ALL SUBSCRIPTIONS
  return res.status(200).json({
    status: "success",
    data: subscriptions,
  });
});
// ######################################### GET EVENTS SUBSCRIBED BY USER #########################################
exports.getUserEvents = catchAsync(async (req, res, next) => {
  // 1) CHECK IF THERE IS SUBSCRIPTION FOR THIS USER
  const userId = req.params.userId;
  const subscriptions = await Attendance.find({ user: userId })
    .populate("event", "-__v -createdAt -updatedAt ")
    .select("-__v -_id -user")
    .exec();
  if (!subscriptions.length) {
    return next(new AppError("No subscriptions found for this user", 404));
  }
  // 2) RETURN ALL SUBSCRIPTIONS
  return res.status(200).json({
    status: "success",
    data: subscriptions,
  });
});
