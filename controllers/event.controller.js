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

// ######################################### CLOSE EVENT #########################################
exports.closeEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { isOpen: false },
    {
      runValidators: true,
    }
  );

  if (!event) {
    return next(new AppError("No event found with that id", 404));
  }

  res.status(204).json({
    status: "success",
    data: event,
  });
});
