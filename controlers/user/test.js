// linking test 

import Car from "../../models/scans/carModel.js";
import Bike from "../../models/scans/bikeModel.js";
import Tag from "../../models/scans/tagModel.js";
import Key from "../../models/scans/keyModel.js";

// prefix map to auto-detect asset type
const PREFIX_MAP = {
  C: { model: Car, userField: "cars" },
  B: { model: Bike, userField: "bikes" },
  T: { model: Tag, userField: "tags" },
  K: { model: Key, userField: "keyTags" },
};



export const linkToUser = async (req, res) => {
  try {
    const userId = req.user?._id || req.params?.userId;
    const { serialNumber } = req.body;

    if (!userId || !serialNumber) {
      return res.status(400).json({
        success: false,
        message: "userId and serialNumber are required",
      });
    }

    // detect model based on first letter
    const prefix = serialNumber[0].toUpperCase();
    const config = PREFIX_MAP[prefix];

    if (!config) {
      return res.status(400).json({
        success: false,
        message: "Invalid serialNumber prefix",
      });
    }

    const { model, userField } = config;

    // find asset
    const asset = await model.findOne({ serialNumber });

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Serial number not found",
      });
    }

    // reject if deleted
    if (asset.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Asset is deleted. Cannot link.",
      });
    }

    // reject if linked
    if (asset.isLinked) {
      return res.status(400).json({
        success: false,
        message: "Asset already linked to a user",
      });
    }

    // find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // link asset → user objectId array
    user[userField].push(asset._id);

    // link serial globally
    user.serialAll.push(serialNumber);

    await user.save();

    // link user → asset
    asset.owner = userId;
    asset.isLinked = true;
    await asset.save();

    return res.status(200).json({
      success: true,
      message: "Asset linked successfully",
      linkedType: userField,
      serialNumber,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};