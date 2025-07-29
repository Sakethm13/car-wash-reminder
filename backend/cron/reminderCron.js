const cron = require("node-cron");
const Reminder = require("../models/reminder");
const sendSMS = require("../utils/sendSMS");

const reminderCron = cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const nowDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const nowTime = now.toTimeString().slice(0, 5);   // HH:MM

    const dueReminders = await Reminder.find({
      date: nowDate,
      time: nowTime,
    });

    for (const reminder of dueReminders) {
      await sendSMS(
        reminder.phone,
        `📅 Reminder: Hi ${reminder.name}, it's time for your car wash. Please visit us soon!.`
      );
      console.log("✅ Reminder sent to:", reminder.phone);
    }
  } catch (err) {
    console.error("❌ Error in Reminder Cron:", err);
  }
});

module.exports = reminderCron;
