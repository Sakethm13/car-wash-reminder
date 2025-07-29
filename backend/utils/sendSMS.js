const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const sendSMS = async (message, numbers) => {
  try {
    const res = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q",
        message,
        language: "english",
        unicode: "0", // Ensures it's treated as GSM (no extra charges)
        flash: 0,
        numbers: numbers.join(","),
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("❌ SMS sending error:", err.message);
    throw err;
  }
};

module.exports = sendSMS;
