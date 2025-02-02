const Event = require("../models/event.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/app.error");

// ######################################### GET ALL EVENTS #########################################

exports.getAllEvents = catchAsync(async (req, res, next) => {
  const events = await Event.find();
  if (!events) {
    return next(new AppError("There is no events found", 404));
  }
  res.status(200).json({
    status: "success",
    data: events,
  });
});

// ######################################### GET EVENT #########################################
exports.getEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError("No event found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: event,
  });
});

// ######################################### ADD EVENT #########################################
exports.createEvent = catchAsync(async (req, res, next) => {
  req.body.admin = req.user._id;
  const event = await Event.create(req.body);

  res.status(201).json({
    status: "success",
    data: event,
  });
});

// ######################################### UPDATE EVENT #########################################
exports.updateEvent = catchAsync(async (req, res, next) => {
  req.body.admin = req.user._id;
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!event) {
    return next(new AppError("No event found with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: event,
  });
});

// ######################################### DELETE EVENT #########################################
exports.deleteEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    return next(new AppError("No event found with that id", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// ######################################### SUBSCRIBE TO EVENT #########################################
exports.subscribeToEvent = catchAsync(async (req, res, next) => {
  // 1) CHECK IF THE EVENT WITH REQ.PARAMS.ID EXISTS
  const event = await Event.findById(req.params.id);
  if (!event) {
    return next(new AppError("There is no event with that id", 404));
  }
  // 2) CHECK IF THE USER IS ALREADY A VOLUNTEER IN THIS EVENT
  if (event.volunteers.includes(req.user._id)) {
    return next(new AppError("You are already a volunteer in this event", 400));
  }
  // 3) ADD THE USER ID (REQ.USER) IN THE VOLUNTEERS FOR THIS SPECIFIC EVENT
  event.volunteers.push(req.user._id);
  await event.save();
  return res.status(200).json({
    status: "success",
    data: event,
  });
});
