import userModel from "../../models/userModel.js";


export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      name,
      phone,
      country_code,
      addressLine,
      city,
      state,
      pin,
      country
    } = req.body;

    const updateData = {};

    // Name
    if (name) {
      updateData.name = name.trim();
    }

    // Phone mapping
    if (phone || country_code) {
      const e164 =
        phone && country_code ? `${country_code}${phone}` : undefined;

      updateData.phone = {
        countryCode: country_code,
        number: phone,
        e164
      };
    }

    // Address mapping
    if (
      addressLine ||
      city ||
      state ||
      pin ||
      country
    ) {
      updateData.address = {
        addressLine,
        city,
        state,
        pin,
        country
      };
    }

    updateData.isProfileUpdated = true;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true,
        runValidators: true
      }
    ).select("-__v");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });

  } catch (error) {
    console.error("Profile Update Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message
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
