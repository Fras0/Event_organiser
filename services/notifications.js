const AppError = require("./../utils/app.error");
const Notification = require("./../models/notification.model");
const User = require("./../models/user.model");
const admin = require("../config/firebaseConfig");

exports.createEvenNotification = async function (event) {
  try {
    // 1) SEND NOTIFICATIONS WITH FCM
    const volunteers = await User.find({ role: "volunteer" }).select(
      "+fcmToken"
    );
    const message = {
      notification: {
        title: "New Event Waiting for You",
        body: `${event.name} - ${event.description}`,
      },
      tokens: volunteers.map((volunteer) => volunteer.fcmToken),
    };

    await admin.messaging().sendEachForMulticast(message);
    // 2) CREATE A NOTIFICATIONS FOR THE EVENT
    const notificationPromises = volunteers.map((volunteer) => {
      return Notification.create({
        title: "New event waiting for you",
        body: `${event.name}`,
        user: volunteer._id,
        topic: "events",
        callback: `/events/${event._id}`,
      });
    });

    await Promise.all(notificationPromises);
  } catch (err) {
    console.log(err);
    throw new AppError("Error adding notification to the collection", 500);
  }
};
