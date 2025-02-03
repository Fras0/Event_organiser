const mongoose = require("mongoose");
const attendanceSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: "Event",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  state: {
    type: String,
    enum: ["interested", "attended"],
    default: "interested",
  },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
