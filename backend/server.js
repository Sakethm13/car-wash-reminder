const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");

dotenv.config();

const app = express();

// ✅ Allow CORS only from Vercel frontend
const allowedOrigins = ['https://car-wash-reminder.vercel.app'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());

// Register Mongoose Models
require("./models/customer");
const Reminder = require("./models/reminder");

// Routes
const dashboardRoutes = require('./routes/dashboard');
const customerRoutes = require("./routes/customerRoutes");
const reminderRoutes = require("./routes/reminderRoutes");

app.use('/api/dashboard', dashboardRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/customers", customerRoutes);

// SMS utility
const sendSMS = require("./utils/sendSMS");

// 🆕 Import auto reminder generator
const generateRemindersFromCustomers = require("./utils/generateRemindersFromCustomers");

// Root Route
app.get("/", (req, res) => {
  res.send("🟢 Backend is working!");
});

// Test SMS Route
app.get("/api/test-sms", async (req, res) => {
  try {
    const testNumber = "7795704327"; // Replace with your number
    const response = await sendSMS(
      "Test: Car Wash Reminder App is working.",
      [testNumber]
    );
    res.json({ success: true, data: response });
  } catch (error) {
    console.error("❌ SMS Error:", error.message);
    res.status(500).json({
      success: false,
      message: "SMS failed",
      error: error.message,
    });
  }
});

// Connect to MongoDB and Start Server
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB connected successfully");

    // 🔁 Generate reminders from customers on server start
    await generateRemindersFromCustomers();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

    // 🔁 Daily Cron Job at 2:00 PM IST
    cron.schedule("0 14 * * *", async () => {
      console.log("⏰ Running daily reminder cron job...");

      try {
        const today = new Date().toISOString().split("T")[0];
        const reminders = await Reminder.find({ date: today });

        if (!reminders.length) {
          return console.log("📭 No reminders scheduled for today.");
        }

        for (const reminder of reminders) {
          const { name, phone } = reminder;
          const message = `Hi ${name}, this is a reminder for your car wash scheduled today.`;
          await sendSMS(message, [phone]);
          console.log(`✅ Reminder SMS sent to ${name} (${phone})`);
        }
      } catch (err) {
        console.error("❌ Cron Job Error:", err.message);
      }
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
