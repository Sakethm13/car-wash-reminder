const express = require('express');
const router = express.Router();

const Customer = require('../models/customer');
const Reminder = require('../models/reminder');

// Dashboard stats
router.get('/', async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const totalReminders = await Reminder.countDocuments();

    // SMS sent today — assume reminder has a sentAt field
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const smsSentToday = await Reminder.countDocuments({
      sentAt: { $gte: todayStart },
    });

    res.json({ totalCustomers, totalReminders, smsSentToday });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Failed to load dashboard data' });
  }
});

module.exports = router;
