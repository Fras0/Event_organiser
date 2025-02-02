const AppError = require("./../utils/app.error");
const Notification = require("./../models/notification.model");
const User = require("./../models/user.model");
const admin = require("../config/firebaseConfig");

exports.createEventNotification = async function (event) {
  try {
    // 1) SEND NOTIFICATIONS WITH FCM
    const volunteers = await User.find({ role: "volunteer" }).select(
      "+fcmToken"
    );
    const message = {
      notification: {
        title: "!هناك عمل تطوعي جديد في انتظارك",
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
        title: "!هناك عمل تطوعي جديد في انتظارك",
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
