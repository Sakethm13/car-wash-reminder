const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");
const Reminder = require("../models/reminder");
const sendSMS = require("../utils/sendSMS");
const moment = require("moment");

// POST /api/customers
router.post("/", async (req, res) => {
  const { name, phone, nextVisitDate } = req.body;

  try {
    const newCustomer = new Customer({ name, phone, nextVisitDate });
    await newCustomer.save();

    const message = `Hi ${name}, your next car wash is on ${new Date(
      nextVisitDate
    ).toLocaleDateString()}. We will remind you.`;
    await sendSMS(message, [phone]);

    // ✅ Only create reminder if nextVisitDate is in the future
    const now = new Date();
    const visitDate = new Date(nextVisitDate);

    if (visitDate > now) {
      const formattedDate = visitDate.toISOString().split("T")[0];

      const existingReminder = await Reminder.findOne({
        phone,
        date: formattedDate,
      });

      if (!existingReminder) {
        const reminder = new Reminder({
          name,
          phone,
          date: formattedDate,
          time: moment("6:00 PM", ["h:mm A"]).format("HH:mm"),
        });
        await reminder.save();
      }
    }

    res.status(201).json({ success: true, customer: newCustomer });
  } catch (error) {
    console.error("❌ Error adding customer:", error);
    res.status(500).json({ success: false, message: "Failed to add customer", error });
  }
});

// GET /api/customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json({ success: true, customers });
  } catch (error) {
    console.error("❌ Error fetching customers:", error);
    res.status(500).json({ success: false, message: "Failed to fetch customers", error });
  }
});

// PUT /api/customers/:id
router.put("/:id", async (req, res) => {
  const { name, phone, nextVisitDate, carNumber } = req.body;

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, phone, carNumber, nextVisitDate },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    // ✅ Only create/update reminder if nextVisitDate is in the future
    const now = new Date();
    const visitDate = new Date(nextVisitDate);

    if (visitDate > now) {
      const reminderDate = visitDate.toISOString().split("T")[0];
      const reminderTime = moment("6:00 PM", ["h:mm A"]).format("HH:mm");

      const existingReminder = await Reminder.findOne({ phone, date: reminderDate });

      if (existingReminder) {
        existingReminder.name = name;
        existingReminder.phone = phone;
        existingReminder.date = reminderDate;
        existingReminder.time = reminderTime;
        await existingReminder.save();
      } else {
        const newReminder = new Reminder({
          name,
          phone,
          date: reminderDate,
          time: reminderTime,
        });
        await newReminder.save();
      }
    }

    res.json({ success: true, customer: updatedCustomer });
  } catch (error) {
    console.error("❌ Error updating customer:", error);
    res.status(500).json({ success: false, message: "Failed to update customer", error });
  }
});

// DELETE /api/customers/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    await Reminder.deleteMany({ phone: deletedCustomer.phone });

    res.json({ success: true, message: "Customer and associated reminders deleted" });
  } catch (error) {
    console.error("❌ Error deleting customer:", error);
    res.status(500).json({ success: false, message: "Failed to delete customer" });
  }
});

module.exports = router;
