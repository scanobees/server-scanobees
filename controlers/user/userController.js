import userModel from "../../models/userModel.js";


export const updateUserProfile = async (req, res) => {
  try {
    // 🛡 Auth guard (protect middleware already ran)
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const userId = req.user.id;

    const updatePayload = {};

    // ✅ Allow only safe fields
    const allowedFields = [
      "name",
      "phone.countryCode",
      "phone.number",
      "address.addressLine",
      "address.city",
      "address.state",
      "address.pin",
      "address.country"
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updatePayload[field] = req.body[field];
      }
    }

    // Always mark profile updated
    updatePayload.isProfileUpdated = true;

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { $set: updatePayload },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found or deleted"
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error("Profile Update Error:", error);

    return res.status(500).json({
      success: false,
      message: "Profile update failed"
    });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await userModel
      .findById(userId)
      .select("-password -__v"); 

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error("Get User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user details"
    });
  }
};
