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
const eventRoutes = require("./routes/event.routes");
const attendanceRoutes = require("./routes/attendance.routes");

// MIDDLEWARES
app.use(express.json());

app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/v1/authentication", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/attendances", attendanceRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandlerMiddleware);

module.exports = app;
