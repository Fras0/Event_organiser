const jwt = require("jsonwebtoken");
const AppError = require("../utils/app.error");
const User = require("../models/user.model");
const catchAsync = require("./../utils/catchAsync");
const { promisify } = require("util");

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If token doesn't exist, return an error response
  if (!token) {
    return next(new AppError("There is no access token", 401)); // Immediately return, do not call next() further
  }

  // Verify the token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_ACCESS
  );

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    ); // Immediately return, do not proceed further
  }

  // Attach user to the request object for further middleware/controllers
  req.user = currentUser;

  next(); // Proceed to the next middleware/controller
});
