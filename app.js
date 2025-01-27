const express = require("express");
const morgan = require("morgan");
const errorHandlerMiddleware = require("./utils/error.handler");
const AppError = require("./utils/app.error");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.use(cors("*"));

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const notificationRoutes = require("./routes/notification.routes");

// MIDDLEWARES
app.use(express.json());

app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/v1/authentication", authRoutes);
app.use("/api/v1/users", userRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandlerMiddleware);

module.exports = app;
