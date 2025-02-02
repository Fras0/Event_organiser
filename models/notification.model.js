const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Provide a title to the notification"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "Provide content to the notification"],
    },
    topic: {
      type: String,
    },
    callback: {
      type: String,
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
