const Customer = require("../models/customer");
const Reminder = require("../models/reminder");
const moment = require("moment");

const generateRemindersFromCustomers = async () => {
  try {
    const customers = await Customer.find({});
    let createdCount = 0;

    for (const customer of customers) {
      if (!customer.nextVisitDate) continue;  // ✅ fixed field name

      const formattedDate = moment(customer.nextVisitDate).format("YYYY-MM-DD");

      const existingReminder = await Reminder.findOne({
        phone: customer.phone,
        date: formattedDate,
      });

      if (!existingReminder) {
        await Reminder.create({
          name: customer.name,
          phone: customer.phone,
          date: formattedDate,
          time: "10:00 AM", // default reminder time
        });
        createdCount++;
      }
    }

    console.log(`🔄 ${createdCount} reminders created from customer records.`);
  } catch (err) {
    console.error("❌ Error generating reminders from customers:", err.message);
  }
};

module.exports = generateRemindersFromCustomers;
