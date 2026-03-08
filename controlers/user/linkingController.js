import bikeModel from "../../models/scans/bikeModel.js";
import businessCardModel from "../../models/scans/businessCardModel.js";
import carModel from "../../models/scans/carModel.js";
import keyModel from "../../models/scans/keyModel.js";
import petTagModel from "../../models/scans/petTagModel.js";
import reviewCardModel from "../../models/scans/reviewCardModel.js";
import tagModel from "../../models/scans/tagModel.js";
import userModel from "../../models/userModel.js";


export const linkBySerialNumber = async (req, res) => {
  try {
    const { serialNumber } = req.body;
    const userId = req.user._id;

    if (!serialNumber)
      return res.status(400).json({ message: "Serial number is required" });

    const prefix = serialNumber[0].toUpperCase();

    const MODEL_MAP = {
      C: { model: carModel, userField: "cars" },
      B: { model: bikeModel, userField: "bikes" },
      T: { model: tagModel, userField: "tags" },
      K: { model: keyModel, userField: "keyTags" },
      U: { model: businessCardModel, userField: "businessCards" },
      P: { model: petTagModel, userField: "petTags" },
      R: { model: reviewCardModel, userField: "reviewCards" }
    };

    const config = MODEL_MAP[prefix];

    if (!config)
      return res.status(400).json({ message: "Invalid serial number prefix" });

    const { model, userField } = config;

    // Find tag / vehicle
    const item = await model.findOne({ serialNumber });

    if (!item)
      return res.status(404).json({ message: "Serial number not found" });

    if (item.isDeleted)
      return res.status(400).json({ message: "This item is deleted" });

    if (item.isLinked && item.owner?.toString() !== userId.toString())
      return res.status(400).json({ message: "Already linked to another user" });

    // Fetch user
    const user = await userModel.findById(userId);

    // Prevent duplicate linking
    if (user.serialAll.includes(serialNumber))
      return res.status(400).json({ message: "Already linked to your account" });

    /* ----------------------------
       UPDATE USER
    ----------------------------- */
    user[userField].push(item._id);
    user.serialAll.push(serialNumber);
    await user.save();

    /* ----------------------------
       UPDATE ITEM
    ----------------------------- */
    item.owner = userId;
    item.isLinked = true;
    await item.save();

    return res.status(200).json({
      message: "Successfully linked",
      type: model.modelName,
      serialNumber
    });

  } catch (error) {
    console.error("Linking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




export const unlinkBySerialNumber = async (req, res) => {
  try {
    const { serialNumber } = req.body;
    const userId = req.user._id;

    if (!serialNumber)
      return res.status(400).json({ message: "Serial number is required" });

    const prefix = serialNumber[0].toUpperCase();

    const MODEL_MAP = {
      C: { model: carModel, userField: "cars" },
      B: { model: bikeModel, userField: "bikes" },
      T: { model: tagModel, userField: "tags" },
      K: { model: keyModel, userField: "keyTags" },
      U: { model: businessCardModel, userField: "businessCards" },
      P: { model: petTagModel, userField: "petTags" },
      R: { model: reviewCardModel, userField: "reviewCards" }
    };

    const config = MODEL_MAP[prefix];

    if (!config)
      return res.status(400).json({ message: "Invalid serial number prefix" });

    const { model, userField } = config;

    // Find item
    const item = await model.findOne({ serialNumber });

    if (!item)
      return res.status(404).json({ message: "Serial number not found" });

    if (!item.isLinked)
      return res.status(400).json({ message: "Item is not linked" });

    if (item.owner?.toString() !== userId.toString())
      return res.status(403).json({ message: "You are not the owner of this item" });

    /* ----------------------------
       UPDATE USER (Atomic Pull)
    ----------------------------- */
    await userModel.findByIdAndUpdate(userId, {
      $pull: {
        [userField]: item._id,
        serialAll: serialNumber
      }
    });

    /* ----------------------------
       UPDATE ITEM
    ----------------------------- */
    await model.findByIdAndUpdate(item._id, {
      owner: null,
      isLinked: false
    });

    return res.status(200).json({
      message: "Successfully unlinked",
      type: model.modelName,
      serialNumber
    });

  } catch (error) {
    console.error("Unlinking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};