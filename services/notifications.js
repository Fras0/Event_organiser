const AppError = require("./../utils/app.error");
const Notification = require("./../models/notification.model");
const User = require("./../models/user.model");
const Attendance = require("./../models/attendance.model");
const admin = require("../config/firebaseConfig");
const dayjs = require("dayjs");

exports.createEventNotification = async function (event) {
  try {
    // 1) SEND NOTIFICATIONS WITH FCM
    const volunteers = await User.find({ role: "volunteer" }).select(
      "+fcmToken"
    );
    const message = {
      notification: {
        title: "There is new event waiting for you",
        body: `${event.name} - ${event.description}`,
      },
      data: {
        callback: `/events/${event._id}`,
      },
      tokens: volunteers.map((volunteer) => volunteer.fcmToken),
    };

    await admin.messaging().sendEachForMulticast(message);
    // 2) CREATE A NOTIFICATIONS FOR THE EVENT
    const notificationPromises = volunteers.map((volunteer) => {
      return Notification.create({
        title: "There is new event waiting for you",
        body: `${event.name}`,
        user: volunteer._id,
        topic: "events",
        callback: `/events/${event._id}`,
      });
    });

    await Promise.all(notificationPromises);
  } catch (err) {
    throw new AppError("Error adding notification to the collection", 500);
  }
};

exports.eventReminderNotification = async function (event) {
  try {
    // 1) Find all users who are attending the event
    const attendances = await Attendance.find({
      event: event._id,
      state: "interested",
    }).populate("user", "fcmToken");

    // 2) Extract FCM tokens for users
    const fcmTokens = attendances
      .map((attendance) => attendance.user.fcmToken)
      .filter((token) => token); // Only keep non-null tokens

    if (fcmTokens.length === 0) {
      throw new AppError("No users with valid FCM tokens for this event.", 500);
    }

    // 3) Send the FCM notification
    const eventDate = dayjs(event.dateTime).format("YYYY-MM-DD");
    const eventTime = dayjs(event.dateTime).format("h:mm A");

    const message = {
      notification: {
        title: `Reminder: Event happening soon!`,
        body: `${event.name} is happening on ${eventDate} at ${eventTime}. Don’t miss it!`,
      },
      data: {
        callback: `/events/${event._id}`,
      },
      tokens: fcmTokens,
    };

    await admin.messaging().sendEachForMulticast(message);

    // Step 3: Create database notifications for each user
    const notificationPromises = attendances.map((attendance) => {
      return Notification.create({
        title: `Reminder: Event happening soon!`,
        body: `${event.name} is happening on ${eventDate} at ${eventTime}.`,
        user: attendance.user._id,
        topic: "events",
        callback: `/events/${event._id}`,
      });
    });

    await Promise.all(notificationPromises);
  } catch (err) {
    throw new Error("Error sending reminder notification", 500);
  }
};
