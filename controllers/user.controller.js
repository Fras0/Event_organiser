const User = require("../models/user.model");
const AppError = require("../utils/app.error");
const catchAsync = require("../utils/catchAsync");

// ######################################### GET ALL USERS #########################################

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(new (AppError("There is no users found", 404))());
  }
  res.status(200).json({
    status: "success",
    data: users,
  });
});

// ######################################### MAKE THE LOGGED IN USER IN THE PARAMETERS #########################################
exports.getMe = (req, res, next) => {
  req.params.userId = req.user.id;
  next();
};
