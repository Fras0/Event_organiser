const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/app.error");
const jwt = require("jsonwebtoken");
const {
  validEmail,
  passwordConfirmed,
} = require("../utils/validators/user.validator");
const { createSendAccessRefresh } = require("../utils/authentication");

// ######################################### SIGN UP #########################################
exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword, role, phone } = req.body;

  // 1) CHECK IF THE USER ENTERED VALID DATA
  if (!validEmail(email)) {
    return next(new AppError("Please use a valid email", 400));
  }
  if (!passwordConfirmed(password, confirmPassword)) {
    return next(
      new AppError("Password and confirm password must be the same", 400)
    );
  }

  // 2) CHECK IF THE USER ALREADY EXISTS
  const userExists = await User.findOne({ email: email });
  if (userExists) {
    return next(new AppError("user already exists", 400));
  }

  // 3) ADD THE USER TO THE DATABASE
  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
  });

  // 4) SEND ACCESS TOKEN STORE REFRESH TOKEN IN DATABASE AND COOKIES
  if (user) {
    createSendAccessRefresh(user, 201, res);
  } else {
    return next(new AppError("invalid user data", 400));
  }
});

// ######################################### LOG IN #########################################
exports.login = catchAsync(async (req, res, next) => {
  // 1) CHECK USER ENTERED DATA
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // 2) CHECK IF THE USER EXISTS
  // AND CHECK IF THE PASSWORD MATCH THE USER
  const user = await User.findOne({ email: email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 403));
  }

  // 3) SEND ACCESS TOKEN STORE REFRESH TOKEN IN DATABASE AND COOKIES
  createSendAccessRefresh(user, 200, res);
});

// ######################################### LOG OUT #########################################
exports.logout = catchAsync(async (req, res, next) => {
  // 1) GET THE REFRESH TOKEN FROM COOKIES
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(new AppError("There is no refresh token found", 400));
  }

  // 2) DECODE THE REFRESH TOKEN AND GET THE USER ID FOR IT
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);

  const user = await User.findById(decoded.id);

  // 3) REMOVE REFRESH TOKEN FROM DATABASE
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  // 4) REMOVE THE REFRESH TOKEN FROM COOKIES
  res.clearCookie("refreshToken");

  return res.status(204).send();
});

// ######################################### REFRESH TOKEN #########################################
exports.refreshToken = catchAsync(async (req, res, next) => {
  // 1) CHECK THE REQUEST COOKIES FOR REFRESH TOKEN
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(new AppError("Refresh token not found", 401));
  }
  // 2) CHECK IF THE REFRESH TOKEN IS VALID
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);

  // 3) CHECK IF THE REFRESH TOKEN IN THE DATABASE FOR THIS USER
  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user || user.refreshToken !== refreshToken) {
    return next(new AppError("Invalid refresh token", 403));
  }

  // 4) CREATE NEW ACCESS AND REFRESH TOKEN FOR THE USER
  createSendAccessRefresh(user, 200, res);
});
