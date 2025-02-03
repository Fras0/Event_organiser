const jwt = require("jsonwebtoken");
const User = require("./../models/user.model");

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_ACCESS, {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_REFRESH, {
    expiresIn: "3d",
  });
};

exports.createSendAccessRefresh = async (user, statusCode, res) => {
  // 1) CREATE ACCESS AND REFRESH TOKENS
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // 2) SET OPTIONS FOR COOKIES
  const cookieOptions = {
    expires: new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 3 // 3 DAYS
    ),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  };

  // 3) ADD THE REFRESH TOKEN IN THE COOKIES
  res.cookie("refreshToken", refreshToken, cookieOptions);

  // 4) ADD THE REFRESH TOKEN FOR THE USER IN THE DATABASE
  user.refreshToken = refreshToken;
  await user.save();
  // 5) ALLOW ACCESS FOR THE USER BY GIVING ACCESS TOKEN TO HIM
  user.password = undefined;
  user.refreshToken = undefined;

  res.status(statusCode).json({
    status: "success",
    accessToken,
    data: {
      user,
    },
  });
};
