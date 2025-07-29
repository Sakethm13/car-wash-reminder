const express = require("express");
const router = express.Router();
const Reminder = require("../models/reminder");
const moment = require("moment");

// 🔹 Add a new reminder
router.post("/", async (req, res) => {
  try {
    const { name, phone, date, time } = req.body;

    // Convert to 24-hour format
    const time24 = moment(time, ["h:mm A", "HH:mm"]).format("HH:mm");

    const newReminder = new Reminder({ name, phone, date, time: time24 });
    await newReminder.save();

    res.status(201).json({ success: true, message: "Reminder added", data: newReminder });
  } catch (err) {
    console.error("❌ Error creating reminder:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 🔹 Default: Get all reminders (used by frontend at /api/reminders)
router.get("/", async (req, res) => {
  try {
    const reminders = await Reminder.find().sort({ date: 1 });
    res.json({ success: true, data: reminders });
  } catch (err) {
    console.error("❌ Error fetching reminders:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 🔹 Get all reminders (both past and future) - alternate route
router.get("/all", async (req, res) => {
  try {
    const reminders = await Reminder.find().sort({ date: 1 });
    res.json({ success: true, data: reminders });
  } catch (err) {
    console.error("❌ Error fetching all reminders:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 🔹 Get only upcoming reminders (today or future)
router.get("/upcoming", async (req, res) => {
  try {
    const today = moment().startOf("day");

    const reminders = await Reminder.find().sort({ date: 1 });

    const upcoming = reminders.filter(reminder =>
      moment(reminder.date, "YYYY-MM-DD").isSameOrAfter(today)
    );

    res.json({ success: true, data: upcoming });
  } catch (err) {
    console.error("❌ Error fetching upcoming reminders:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 🔹 Get only past reminders (before today)
router.get("/past", async (req, res) => {
  try {
    const today = moment().startOf("day");

    const reminders = await Reminder.find().sort({ date: -1 });

    const past = reminders.filter(reminder =>
      moment(reminder.date, "YYYY-MM-DD").isBefore(today)
    );

    res.json({ success: true, data: past });
  } catch (err) {
    console.error("❌ Error fetching past reminders:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// 🔹 Delete a reminder
router.delete("/:id", async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Reminder deleted" });
  } catch (err) {
    console.error("❌ Error deleting reminder:", err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
