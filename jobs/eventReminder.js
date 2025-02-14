const AppError = require("./../utils/app.error");
const cron = require("node-cron");
const { eventReminderNotification } = require("./../services/notifications");
const Event = require("./../models/event.model");
const moment = require("moment");

// every day
// cron.schedule("* * * * *", async () => {
cron.schedule("0 0 * * *", async () => {
  try {
    const now = moment().utc().toDate();
    const oneDayLater = moment().add(1, "days").utc().toDate();

    const events = await Event.find({
      dateTime: { $gte: now, $lte: oneDayLater },
    });
    events.forEach((event) => {
      eventReminderNotification(event); // Send reminder notification for each event
    });
  } catch (err) {
    throw new AppError("Error in reminder job: ", 500);
  }
});
