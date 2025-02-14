const User = require("../models/user.model");
const AppError = require("../utils/app.error");
const catchAsync = require("../utils/catchAsync");

// ######################################### GET ALL USERS #########################################
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(new AppError("There is no users found", 404));
  }
  res.status(200).json({
    status: "success",
    data: users,
  });
});

// ######################################### GET USER #########################################
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(new AppError("There is no user found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});
// ######################################### UPDATE USER #########################################
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("No user found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});
// ######################################### DELETE USER #########################################
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.userId);

  if (!user) {
    return next(new AppError("No user found with that id", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// ######################################### MAKE THE LOGGED IN USER IN THE PARAMETERS #########################################
exports.getMe = (req, res, next) => {
  req.params.userId = req.user._id;
  next();
};
// ######################################### DELETE ME #########################################
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});
