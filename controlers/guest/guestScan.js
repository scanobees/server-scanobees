
import bikeModel from "../../models/scans/bikeModel.js";
import businessCardModel from "../../models/scans/businessCardModel.js";
import carModel from "../../models/scans/carModel.js";
import keyModel from "../../models/scans/keyModel.js";
import petTagModel from "../../models/scans/petTagModel.js";
import tagModel from "../../models/scans/tagModel.js";

const PREFIX_MAP = {
  C: carModel,
  B: bikeModel,
  T: tagModel,
  K: keyModel,
  U: businessCardModel,
  P: petTagModel
};


export const getSerialDetails = async (req, res) => {
  try {
    const { serialNumber } = req.params;

    if (!serialNumber) {
      return res.status(400).json({
        success: false,
        message: "serialNumber param is required",
      });
    }

    const prefix = serialNumber[0]; // first letter
    const model = PREFIX_MAP[prefix];

    if (!model) {
      return res.status(400).json({
        success: false,
        message: "Invalid prefix: must start with C, B, T or K",
      });
    }

    const result = await model.findOne({ serialNumber });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Serial number not found",
      });
    }

    return res.status(200).json({
      success: true,
      type: prefix === "C" ? "car" : prefix === "B" ? "bike" : prefix === "T" ? "tag" : "keytag",
      data: result
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};