import carModel from "../../models/scans/carModel.js";
import { sendWhatsAppMessage } from "../../utils/whatsappSender.js";



// export const sendCarAlert = async (req, res) => {
//   try {
//     const { serialNumber, regNumber, issueReason } = req.body;

//     if (!serialNumber || !regNumber || !issueReason) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields",
//       });
//     }

//     const car = await carModel.findOne({
//       serialNumber,
//       isDeleted: false,
//     }).lean();

//     if (!car) {
//       return res.status(404).json({
//         success: false,
//         message: "Car not found",
//       });
//     }

//     if (car.paused || !car.isLinked) {
//       return res.status(403).json({
//         success: false,
//         message: "Car alerts are disabled",
//       });
//     }

//     if (!car.phone?.e164) {
//       return res.status(400).json({
//         success: false,
//         message: "Owner phone not available",
//       });
//     }

//     await sendWhatsAppMessage({
//       to: car.phone.e164,
//       templateName: "scanobees_car_msg",
//       parameters: [
//         String(regNumber),   // First {}
//         String(regNumber),   // Second {}
//         String(issueReason), // Third {}
//       ],
//     });

//     res.json({
//       success: true,
//       message: "WhatsApp alert sent successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to send WhatsApp alert",
//     });
//   }
// };


// export const sendCarAlert = async (req, res) => {
//   try {
//     // Only extracting the bare essentials for the message
//     const { regNumber, issueReason, phoneNumber } = req.body;

//     // Validation: only checking for what we actually use
//     if (!regNumber || !issueReason || !phoneNumber) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields (regNumber, issueReason, or phoneNumber)",
//       });
//     }

//     // Direct execution
//     await sendWhatsAppMessage({
//       to: phoneNumber,
//       templateName: "scanobees_car_msg",
//       parameters: [
//         String(regNumber),   
//         String(regNumber),   
//         String(issueReason), 
//       ],
//     });

//     res.json({
//       success: true,
//       message: `WhatsApp alert sent successfully to ${phoneNumber}`,
//     });
//   } catch (error) {
//     console.error("Sampling Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to send WhatsApp alert",
//       error: error.message
//     });
//   }
// };


export const sendCarAlert = async (req, res) => {
  console.log("▶️ sendCarAlert called");

  try {
    console.log("📥 Raw req.body:", req.body);

    const { regNumber, issueReason, phoneNumber } = req.body;

    // 1️⃣ Validate input
    console.log("🔎 Extracted values:", {
      regNumber,
      issueReason,
      phoneNumber,
    });

    if (!regNumber || !issueReason || !phoneNumber) {
      console.log("❌ Validation failed: missing fields");
      return res.status(400).json({
        success: false,
        message: "Missing required fields (regNumber, issueReason, phoneNumber)",
      });
    }

    // 2️⃣ Log env variables (SAFE CHECK)
    console.log("🔐 Env check:", {
      EXOTEL_API_KEY: !!process.env.EXOTEL_API_KEY,
      EXOTEL_API_TOKEN: !!process.env.EXOTEL_API_TOKEN,
      EXOTEL_ACCOUNT_SID: !!process.env.EXOTEL_ACCOUNT_SID,
      EXOTEL_SUBDOMAIN: process.env.EXOTEL_SUBDOMAIN,
      EXOTEL_WHATSAPP_NUMBER: process.env.EXOTEL_WHATSAPP_NUMBER,
    });

    // 3️⃣ Prepare WhatsApp payload data
    const templateName = "scanobees_car_msg";
    const parameters = [
      String(regNumber),   // First {}
      String(regNumber),   // Second {}
      String(issueReason), // Third {}
    ];

    console.log("📦 WhatsApp send payload:", {
      to: phoneNumber,
      templateName,
      parameters,
    });

    // 4️⃣ Call Exotel util
    console.log("🚀 Calling sendWhatsAppMessage...");
    const response = await sendWhatsAppMessage({
      to: phoneNumber,
      templateName,
      parameters,
    });

    // 5️⃣ Success log
    console.log("✅ Exotel response status:", response?.status);
    console.log("✅ Exotel response data:", response?.data);

    return res.json({
      success: true,
      message: `WhatsApp alert sent successfully to ${phoneNumber}`,
    });
  } catch (error) {
    console.error("🔥 sendCarAlert ERROR");

    // Axios / Exotel detailed error
    if (error.response) {
      console.error("❌ Exotel error status:", error.response.status);
      console.error("❌ Exotel error data:", error.response.data);
    } else {
      console.error("❌ Error message:", error.message);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to send WhatsApp alert",
      error: error.message,
    });
  }
};

export const testApi = (req, res) => {
  console.log("✅ Test API hit");

  res.json({
    success: true,
    message: "hi",
  });
};
