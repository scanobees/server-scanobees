import axios from "axios";
import carModel from "../../models/scans/carModel.js";
import bikeModel from "../../models/scans/bikeModel.js";
import tagModel from "../../models/scans/tagModel.js";

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

    // 📞 Resolve owner phone
    let rawPhone =
      car.phone?.e164 ||
      car.phone?.number ||
      "";

    if (!rawPhone) {
      return res.status(400).json({
        success: false,
        message: "Owner phone number not available",
      });
    }

    // 🧹 Sanitize (digits only)
    rawPhone = rawPhone.replace(/\D/g, "");

    // 🇮🇳 Normalize to India (NO +)
    if (rawPhone.length === 10) {
      rawPhone = `91${rawPhone}`;
    }

    if (rawPhone.length === 11 && rawPhone.startsWith("0")) {
      rawPhone = `91${rawPhone.slice(1)}`;
    }

    // ❌ Final validation for Exotel
    if (!/^91\d{10}$/.test(rawPhone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid owner phone format",
        debugPhone: rawPhone,
      });
    }

    const toNumber = rawPhone;

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

//BIKE
export const sendBikeWhatsappAlert = async (req, res) => {
  try {
    const { serialNumber, regNumber, issueReason } = req.body;

    // ✅ Validation
    if (!serialNumber || !regNumber || !issueReason) {
      return res.status(400).json({
        success: false,
        message: "serialNumber, regNumber and issueReason are required",
      });
    }

    // 🔍 Find bike
    const bike = await bikeModel.findOne({
      serialNumber,
      isDeleted: false,
    });

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found for given serial number",
      });
    }

    // 🔒 Check paused / unlinked
    if (bike.paused || !bike.isLinked) {
      return res.status(403).json({
        success: false,
        message: "Bike is not available for contact",
      });
    }

    // 📞 Resolve owner phone
    let rawPhone =
      bike.phone?.e164 ||
      bike.phone?.number ||
      "";

    if (!rawPhone) {
      return res.status(400).json({
        success: false,
        message: "Owner phone number not available",
      });
    }

    // 🧹 Sanitize digits
    rawPhone = rawPhone.replace(/\D/g, "");

    // 🇮🇳 Normalize India number
    if (rawPhone.length === 10) rawPhone = `91${rawPhone}`;
    if (rawPhone.length === 11 && rawPhone.startsWith("0")) {
      rawPhone = `91${rawPhone.slice(1)}`;
    }

    if (!/^91\d{10}$/.test(rawPhone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid owner phone format",
        debugPhone: rawPhone,
      });
    }

    const toNumber = rawPhone;

    // 📦 Exotel payload
    const payload = {
      custom_data: `BIKE_${regNumber}`,
      status_callback: "https://scanobees.com/webhooks/exotel",
      whatsapp: {
        messages: [
          {
            from: process.env.EXOTEL_WHATSAPP_NUMBER,
            to: toNumber,
            content: {
              type: "template",
              template: {
                name: "bike_alert",
                language: {
                  policy: "deterministic",
                  code: "en",
                },
                components: [
                  {
                    type: "header",
                    parameters: [
                      { type: "text", text: regNumber },
                    ],
                  },
                  {
                    type: "body",
                    parameters: [
                      { type: "text", text: regNumber },
                      { type: "text", text: issueReason },
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
        headers: { "Content-Type": "application/json" },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Bike WhatsApp alert sent successfully",
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Bike WhatsApp Alert Error:",
      error?.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to send bike WhatsApp alert",
      error: error?.response?.data || error.message,
    });
  }
};


//TAG
export const sendTagWhatsappAlert = async (req, res) => {
  try {
    const { serialNumber, nickName } = req.body;

    // ✅ Validation
    if (!serialNumber || !nickName) {
      return res.status(400).json({
        success: false,
        message: "serialNumber and nickName are required",
      });
    }

    // 🔍 Find tag
    const tag = await tagModel.findOne({
      serialNumber,
      isDeleted: false,
    });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found for given serial number",
      });
    }

    // 🔒 Check paused / unlinked
    if (tag.paused || !tag.isLinked) {
      return res.status(403).json({
        success: false,
        message: "Tag is not available for contact",
      });
    }

    // 📞 Resolve owner phone
    let rawPhone =
      tag.phone?.e164 ||
      tag.phone?.number ||
      "";

    if (!rawPhone) {
      return res.status(400).json({
        success: false,
        message: "Owner phone number not available",
      });
    }

    // 🧹 Sanitize digits
    rawPhone = rawPhone.replace(/\D/g, "");

    // 🇮🇳 Normalize India number
    if (rawPhone.length === 10) rawPhone = `91${rawPhone}`;
    if (rawPhone.length === 11 && rawPhone.startsWith("0")) {
      rawPhone = `91${rawPhone.slice(1)}`;
    }

    if (!/^91\d{10}$/.test(rawPhone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid owner phone format",
        debugPhone: rawPhone,
      });
    }

    const toNumber = rawPhone;

    // 📦 Exotel payload (TAG specific)
    const payload = {
      custom_data: `TAG_${serialNumber}`,
      status_callback: "https://scanobees.com/webhooks/exotel",
      whatsapp: {
        messages: [
          {
            from: process.env.EXOTEL_WHATSAPP_NUMBER,
            to: toNumber,
            content: {
              type: "template",
              template: {
                name: "tag_alert",
                language: {
                  policy: "deterministic",
                  code: "en",
                },
                components: [
                  {
                    type: "header",
                    parameters: [
                      { type: "text", text: nickName },
                    ],
                  },
                  {
                    type: "body",
                    parameters: [
                      { type: "text", text: nickName },
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
        headers: { "Content-Type": "application/json" },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Tag WhatsApp alert sent successfully",
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Tag WhatsApp Alert Error:",
      error?.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to send tag WhatsApp alert",
      error: error?.response?.data || error.message,
    });
  }
};