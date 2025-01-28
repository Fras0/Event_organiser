const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Event must has a name"],
      trim: true,
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
    },
    minCandidateRequired: {
      type: Number,
    },
    admin: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "You have to provide the admin that created that event"],
    },
    candidates: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ location: "2dsphere" });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
