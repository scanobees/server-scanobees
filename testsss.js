import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },


    phone: {
      countryCode: { type: String },
      number: { type: String },
      e164: { type: String }
    },

    address: {
      addressLine: String,
      city: String,
      state: String,
      pin: String,
      country: String
    },


    isProfileUpdated: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);







import bikeModel from "../../models/scans/bikeModel.js";
import carModel from "../../models/scans/carModel.js";
import keyModel from "../../models/scans/keyModel.js";
import tagModel from "../../models/scans/tagModel.js";
import {
  generateCarCode,
  generateBikeCode,
  generateTagCode,
  generateKeyTagCode,
} from "../../utils/nanoid.js";


// mapping model + generator function
const TYPE_MAP = {
  car: { model: carModel, generator: generateCarCode },
  bike: { model: bikeModel, generator: generateBikeCode },
  tag: { model: tagModel, generator: generateTagCode },
  keytag: { model: keyModel, generator: generateKeyTagCode },
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
        message: "Invalid type. Allowed types: car, bike, tag, keytag",
      });
    }

    const { model, generator } = config;
    const createdSerials = [];

    let i = 0;
    while (i < count) {
      let serial = generator();

      try {
        const created = await model.create({ serialNumber: serial });
        createdSerials.push(created.serialNumber);
        i++;
      } catch (error) {
        // duplicate serial detected → try again
        if (error.code === 11000) {
          console.log("Duplicate detected, retrying...");
          continue;
        }
        throw error;
      }
    }

    return res.status(201).json({
      success: true,
      total: createdSerials.length,
      serials: createdSerials,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
