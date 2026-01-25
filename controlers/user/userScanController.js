import bikeModel from "../../models/scans/bikeModel.js";
import businessCardModel from "../../models/scans/businessCardModel.js";
import carModel from "../../models/scans/carModel.js";
import keyModel from "../../models/scans/keyModel.js";
import petTagModel from "../../models/scans/petTagModel.js";
import userModel from "../../models/userModel.js";
import tagModel from "../../models/scans/tagModel.js";

export const getUserLinkedAssets = async (req, res) => {
  try {
    const userId = req.user.id; 

    const user = await userModel.findOne({ _id: userId })
      .populate({
        path: "cars",
        match: { isDeleted: false },
        options: { sort: { createdAt: -1 } }
      })
      .populate({
        path: "bikes",
        match: { isDeleted: false },
        options: { sort: { createdAt: -1 } }
      })
      .populate({
        path: "tags",
        match: { isDeleted: false },
        options: { sort: { createdAt: -1 } }
      })
      .populate({
        path: "businessCards",
        match: { isDeleted: false },
        options: { sort: { createdAt: -1 } }
      })
      .populate({
        path: "keyTags",
        match: { isDeleted: false },
        options: { sort: { createdAt: -1 } }
      })
      .populate({
        path: "petTags",
        match: { isDeleted: false },
        options: { sort: { createdAt: -1 } }
      })
      .select(
        "cars bikes tags businessCards keyTags petTags serialAll premium"
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        cars: user.cars,
        bikes: user.bikes,
        tags: user.tags,
        businessCards: user.businessCards,
        keyTags: user.keyTags,
        petTags: user.petTags,
        serialAll: user.serialAll,
        
      }
    });
  } catch (error) {
    console.error("Get linked assets error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



export const getCarBySnUser = async (req, res) => {
  try {
    const { serialNumber } = req.params;

    const car = await carModel.findOne({
      serialNumber: serialNumber.toUpperCase(),
      isDeleted: false
    })
    

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
    console.error("Get Car Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch car details"
    });
  }
};
//

export const getBikeBySnUser = async (req, res) => {
  try {
    const { serialNumber } = req.params;

    const bike = await bikeModel.findOne({
      serialNumber: serialNumber.toUpperCase(),
      isDeleted: false
    });

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
    console.error("Get Bike Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bike details"
    });
  }
};

//

export const getKeyBySnUser = async (req, res) => {
  try {
    const { serialNumber } = req.params;

    const key = await keyModel.findOne({
      serialNumber: serialNumber.toUpperCase(),
      isDeleted: false
    });

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
    console.error("Get Key Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch key details"
    });
  }
};

//

export const getBusinessCardBySnUser = async (req, res) => {
  try {
    const { serialNumber } = req.params;

    const businessCard = await businessCardModel.findOne({
      serialNumber: serialNumber.toUpperCase(),
      isDeleted: false
    });

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
    console.error("Get Business Card Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch business card details"
    });
  }
};

//

export const getPetTagBySnUser = async (req, res) => {
  try {
    const { serialNumber } = req.params;

    const petTag = await petTagModel.findOne({
      serialNumber: serialNumber.toUpperCase(),
      isDeleted: false
    });

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
    console.error("Get Pet Tag Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch pet tag details"
    });
  }
};

//



export const getTagBySnUser = async (req, res) => {
  try {
    const { serialNumber } = req.params;

    const tag = await tagModel.findOne({
      serialNumber: serialNumber.toUpperCase(),
      isDeleted: false
    });

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
    console.error("Get Tag Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tag details"
    });
  }
};
