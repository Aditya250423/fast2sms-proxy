const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;

app.use(cors());
app.use(express.json());

app.post("/send-sms", async (req, res) => {
  const { numbers, message, sender_id = "FSTSMS", route = "p" } = req.body;

  if (!numbers || !message) {
    return res.status(400).json({ error: "Missing numbers or message" });
  }

  try {
    const response = await axios.post(
      "https://api.fast2sms.com/v1/message/send",
      {
        route: route,
        sender_id: sender_id,
        message: message,
        language: "english",
        numbers: numbers,
      },
      {
        headers: {
          authorization: FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json(response.data);
  } catch (error) {
    console.error("Fast2SMS API error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to send SMS", details: error.response?.data || error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Fast2SMS proxy running on port ${PORT}`);
});
