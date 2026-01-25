import bikeModel from "../../models/scans/bikeModel.js";
import businessCardModel from "../../models/scans/businessCardModel.js";
import carModel from "../../models/scans/carModel.js";
import keyModel from "../../models/scans/keyModel.js";
import petTagModel from "../../models/scans/petTagModel.js";
import tagModel from "../../models/scans/tagModel.js";

export const updateCarBySnUser = async (req, res) => {
  try {
    const { serialNumber } = req.params;

    const car = await carModel.findOneAndUpdate(
      { serialNumber: serialNumber.toUpperCase(), isDeleted: false },
      req.body,
      { new: true }
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: car
    });

  } catch (error) {
    console.error("Update Car Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update car details"
    });
  }
};

//

export const updateBikeBySnUser = async (req, res) => {
  try {
    const { serialNumber } = req.params;

    const bike = await bikeModel.findOneAndUpdate(
      { serialNumber: serialNumber.toUpperCase(), isDeleted: false },
      req.body,
      { new: true }
    );

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: bike
    });

  } catch (error) {
    console.error("Update Bike Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update bike details"
    });
  }
};

//

export const updateKeyBySnUser = async (req, res) => {
  try {
    const { serialNumber } = req.params;

    const key = await keyModel.findOneAndUpdate(
      { serialNumber: serialNumber.toUpperCase(), isDeleted: false },
      req.body,
      { new: true }
    );

    if (!key) {
      return res.status(404).json({
        success: false,
        message: "Key not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: key
    });

  } catch (error) {
    console.error("Update Key Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update key details"
    });
  }
};

//

export const updateTagBySnUser = async (req, res) => {
  try {
    const { serialNumber } = req.params;

    const tag = await tagModel.findOneAndUpdate(
      { serialNumber: serialNumber.toUpperCase(), isDeleted: false },
      req.body,
      { new: true }
    );

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: tag
    });

  } catch (error) {
    console.error("Update Tag Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update tag details"
    });
  }
};

//

export const updatePetTagBySnUser = async (req, res) => {
  try {
    const { serialNumber } = req.params;

    const petTag = await petTagModel.findOneAndUpdate(
      { serialNumber: serialNumber.toUpperCase(), isDeleted: false },
      req.body,
      { new: true }
    );

    if (!petTag) {
      return res.status(404).json({
        success: false,
        message: "Pet tag not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: petTag
    });

  } catch (error) {
    console.error("Update Pet Tag Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update pet tag details"
    });
  }
};

//

export const updateBusinessCardBySnUser = async (req, res) => {
  try {
    const { serialNumber } = req.params;

    const businessCard = await businessCardModel.findOneAndUpdate(
      { serialNumber: serialNumber.toUpperCase(), isDeleted: false },
      req.body,
      { new: true }
    );

    if (!businessCard) {
      return res.status(404).json({
        success: false,
        message: "Business card not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: businessCard
    });

  } catch (error) {
    console.error("Update Business Card Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update business card details"
    });
  }
};