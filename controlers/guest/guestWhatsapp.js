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
export const sendCarAlert = async (req, res) => {
  try {
    // Only extracting the bare essentials for the message
    const { regNumber, issueReason, phoneNumber } = req.body;

    // Validation: only checking for what we actually use
    if (!regNumber || !issueReason || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (regNumber, issueReason, or phoneNumber)",
      });
    }

    // Direct execution
    await sendWhatsAppMessage({
      to: phoneNumber,
      templateName: "scanobees_car_msg",
      parameters: [
        String(regNumber),   
        String(regNumber),   
        String(issueReason), 
      ],
    });

    res.json({
      success: true,
      message: `WhatsApp alert sent successfully to ${phoneNumber}`,
    });
  } catch (error) {
    console.error("Sampling Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send WhatsApp alert",
      error: error.message
    });
  }
};