const mongoose = require("mongoose");
const { createEventNotification } = require("../services/notifications");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Event must has a name"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "You have to provide a description for the event"],
    },
    location: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
    },
    dateTime: {
      type: Date,
      required: [true, "The event must has a date"],
      default: Date.now() + 10 * 60 * 1000,
    },
    minVolunteerRequired: {
      type: Number,
    },
    admin: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "You have to provide the admin that created that event"],
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ location: "2dsphere" });

// HANDLING NOTIFICATIONS AFTER CREATING AN EVENT
eventSchema.pre("save", async function (next) {
  if (this.isNew) {
    await createEventNotification(this);
  }
  next();
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
