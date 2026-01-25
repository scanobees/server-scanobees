import bikeModel from "../../models/scans/bikeModel.js";
import carModel from "../../models/scans/carModel.js";
import keyModel from "../../models/scans/keyModel.js";
import tagModel from "../../models/scans/tagModel.js";
import businessCardModel from "../../models/scans/businessCardModel.js";
import petTagModel from "../../models/scans/petTagModel.js";
import tagLog from "../../models/tagLog.js";

import {
  generateCarCode,
  generateBikeCode,
  generateTagCode,
  generateKeyTagCode,
  generateBusinessCardCode,
  generatePetTagCode,
} from "../../utils/nanoid.js";



// mapping model + generator function
const TYPE_MAP = {
  car: { model: carModel, generator: generateCarCode },
  bike: { model: bikeModel, generator: generateBikeCode },
  tag: { model: tagModel, generator: generateTagCode },
  keytag: { model: keyModel, generator: generateKeyTagCode },
  // Added Business Card and Pet Tag
  businesscard: { model: businessCardModel, generator: generateBusinessCardCode },
  pettag: { model: petTagModel, generator: generatePetTagCode },
};

const generateBatchName = async (type) => {
  const prefixMap = {
    car: 'C', bike: 'B', tag: 'T', keytag: 'K', businesscard: 'U', pettag: 'P'
  };

  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // e.g., "26"
  const monthLetter = String.fromCharCode(65 + now.getMonth()); // Jan is 0 -> 'A' (65)
  
  const prefix = prefixMap[type.toLowerCase()] || 'X';
  const batchStart = `${prefix}${year}${monthLetter}`; // e.g., "B26A"

  // Find the last batch created this month with this prefix to increment the number
  const lastEntry = await tagLog.findOne({ 
    batch: { $regex: `^${batchStart}` } 
  }).sort({ createdAt: -1 });

  let sequence = 1;
  if (lastEntry) {
    // Extract the last 3 digits from the batch string and increment
    const lastSequence = parseInt(lastEntry.batch.slice(-3));
    sequence = lastSequence + 1;
  }

  // Pad the sequence with zeros (e.g., 001, 002)
  const paddedSequence = sequence.toString().padStart(3, '0');
  return `${batchStart}${paddedSequence}`;
};


export const createNew = async (req, res) => {
  try {
    const { type, count } = req.body;

    if (!type || !count) {
      return res.status(400).json({
        success: false,
        message: "type and count are required",
      });
    }

    const config = TYPE_MAP[type.toLowerCase()];
    if (!config) {
      return res.status(400).json({
        success: false,
        message: "Invalid type. Allowed: car, bike, tag, keytag, businesscard, pettag",
      });
    }

    const { model, generator } = config;
    const createdSerials = [];

    // --- GENERATE AUTOMATIC BATCH NAME ---
    const batchName = await generateBatchName(type);

    let i = 0;
    while (i < count) {
      let serial = generator();
      try {
        const created = await model.create({ serialNumber: serial });
        createdSerials.push(created.serialNumber);
        i++;
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Duplicate ${type} serial detected, retrying...`);
          continue;
        }
        throw error;
      }
    }

    // --- LOG SYSTEM: Create entry in TagLog collection ---
    await tagLog.create({
      batch: batchName, // Use the auto-generated batch ID
      type: type.toLowerCase(),
      count: createdSerials.length,
      serials: createdSerials,
    });

    return res.status(201).json({
      success: true,
      batch: batchName,
      total: createdSerials.length,
      serials: createdSerials,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// export const createNew = async (req, res) => {
//   try {
//     const { type, count } = req.body;

//     if (!type || !count) {
//       return res.status(400).json({
//         success: false,
//         message: "type and count are required",
//       });
//     }

//     const config = TYPE_MAP[type.toLowerCase()];
//     if (!config) {
//       return res.status(400).json({
//         success: false,
//         // Updated error message to include new types
//         message: "Invalid type. Allowed: car, bike, tag, keytag, businesscard, pettag",
//       });
//     }

//     const { model, generator } = config;
//     const createdSerials = [];

//     let i = 0;
//     while (i < count) {
//       let serial = generator();

//       try {
//         const created = await model.create({ serialNumber: serial });
//         createdSerials.push(created.serialNumber);
//         i++;
//       } catch (error) {
//         // duplicate serial detected → try again (standard MongoDB error code 11000)
//         if (error.code === 11000) {
//           console.log(`Duplicate ${type} serial detected, retrying...`);
//           continue;
//         }
//         throw error;
//       }
//     }

//     return res.status(201).json({
//       success: true,
//       total: createdSerials.length,
//       serials: createdSerials,
//     });

//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };


export const getAllLogs = async (req, res) => {
  try {
    // 1. Get page and limit from query strings (defaults: page 1, limit 20)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // 2. Fetch only the necessary slice of data
    const logs = await tagLog.find()
      .select("-serials")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // 3. Get total count for the frontend to calculate total pages
    const totalLogs = await tagLog.countDocuments();

    if (!logs || logs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No logs found",
      });
    }

    return res.status(200).json({
      success: true,
      count: logs.length,
      totalPages: Math.ceil(totalLogs / limit),
      currentPage: page,
      totalLogs,
      data: logs,
    });
  } catch (error) {
    console.error("Error fetching tag logs:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



export const getLogsByPeriod = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide both startDate and endDate",
      });
    }

    // Convert strings to Date objects
    // We set endDate to the very end of that day (23:59:59) to be inclusive
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const logs = await tagLog.find({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalResults: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error("Error fetching logs by period:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const getLogByBatchName = async (req, res) => {
  try {
    // Accessing 'batch' from the URL path defined in the router
    const { batch } = req.params;

    
    const log = await tagLog.findOne({ 
      batch: { $regex: `^${batch}$`, $options: "i" } 
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        message: `Batch ${batch} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: log,
    });
  } catch (error) {
    console.error("Error fetching batch:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const syncVerifiedSerials = async (req, res) => {
  try {
    const { batch, verifiedSerials } = req.body;

    if (!batch || !Array.isArray(verifiedSerials)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid data: batch name and serials array are required." 
      });
    }

    // Update the document by adding new serials to the existing array
    const updatedLog = await tagLog.findOneAndUpdate(
      { batch: batch },
      { $addToSet: { verifiedSerials: { $each: verifiedSerials } } },
      { new: true }
    );

    if (!updatedLog) {
      return res.status(404).json({ 
        success: false, 
        message: `Batch ${batch} not found.` 
      });
    }

    return res.status(200).json({
      success: true,
      message: "Database synced successfully",
      data: updatedLog.verifiedSerials,
    });
  } catch (error) {
    console.error("Sync Error:", error);
    return res.status(500).json({ success: false, message: "Server error during sync" });
  }
};