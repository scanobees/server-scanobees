import axios from "axios";

export const sendWhatsappMessage = async (req, res) => {
  try {
    const { regNumber, issueReason, phoneNumber } = req.body;

    // ✅ Validation
    if (!regNumber || !issueReason || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "regNumber, issueReason and phoneNumber are required",
      });
    }

    // Normalize phone number (India)
    const toNumber = phoneNumber.startsWith("91")
      ? phoneNumber
      : `91${phoneNumber}`;

    const payload = {
      custom_data: `VEHICLE_${regNumber}`,
      status_callback: "https://scanobees.com/webhooks/exotel",
      whatsapp: {
        messages: [
          {
            from: process.env.EXOTEL_WHATSAPP_NUMBER,
            to: toNumber,
            content: {
              type: "template",
              template: {
                name: "scanobees_vehicle_alert_test",
                language: {
                  policy: "deterministic",
                  code: "en",
                },
                components: [
                  {
                    type: "header",
                    parameters: [
                      {
                        type: "text",
                        text: "June",
                      },
                    ],
                  },
                  {
                    type: "body",
                    parameters: [
                      {
                        type: "text",
                        text: regNumber,
                      },
                      {
                        type: "text",
                        text: issueReason,
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
      },
    };

    const response = await axios.post(
      `https://api.exotel.com/v2/accounts/${process.env.EXOTEL_ACCOUNT_SID}/messages`,
      payload,
      {
        auth: {
          username: process.env.EXOTEL_API_KEY,
          password: process.env.EXOTEL_API_TOKEN,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "WhatsApp message sent successfully",
      data: response.data,
    });

  } catch (error) {
    console.error(
      "Exotel WhatsApp Error:",
      error?.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to send WhatsApp message",
      error: error?.response?.data || error.message,
    });
  }
};


export const testApi = (req, res) => {
  console.log("✅ Test asi hit");

  res.json({
    success: true,
    message: "hi asu",
  });
};



