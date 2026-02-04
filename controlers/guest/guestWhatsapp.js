import axios from "axios";
import carModel from "../../models/scans/carModel";

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
                name: "car_alert",
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
                        text: regNumber,
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



// for car
export const sendCarWhatsappAlert = async (req, res) => {
  try {
    const { serialNumber, regNumber, issueReason } = req.body;

    // ✅ Validation
    if (!serialNumber || !regNumber || !issueReason) {
      return res.status(400).json({
        success: false,
        message: "serialNumber, regNumber and issueReason are required",
      });
    }

    // 🔍 Find car by serialNumber
    const car = await carModel.findOne({
      serialNumber,
      isDeleted: false,
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found for given serial number",
      });
    }

    // 🔒 Check paused / unlinked
    if (car.paused || !car.isLinked) {
      return res.status(403).json({
        success: false,
        message: "Car is not available for contact",
      });
    }

    // 📞 Resolve owner phone (priority: e164 → number)
    let toNumber =
      car.phone?.e164 || car.phone?.number || "";

    if (!toNumber) {
      return res.status(400).json({
        success: false,
        message: "Owner phone number not available",
      });
    }

    // Normalize phone number (India)
    toNumber = toNumber.startsWith("91")
      ? toNumber
      : `91${toNumber}`;

    // 📦 Exotel WhatsApp payload
    const payload = {
      custom_data: `CAR_${regNumber}`,
      status_callback: "https://scanobees.com/webhooks/exotel",
      whatsapp: {
        messages: [
          {
            from: process.env.EXOTEL_WHATSAPP_NUMBER,
            to: toNumber,
            content: {
              type: "template",
              template: {
                name: "car_alert",
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
                        text: regNumber,
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

    // 🚀 Send WhatsApp via Exotel
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
      message: "Car WhatsApp alert sent successfully",
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Car WhatsApp Alert Error:",
      error?.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to send car WhatsApp alert",
      error: error?.response?.data || error.message,
    });
  }
};