const blockIfBlocked = (req, res, next) => {
  try {
    // req.user must be set by auth middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (req.user.activityStatus === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked. Please contact support."
      });
    }

    next(); // user is allowed
  } catch (error) {
    console.error("Block middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export default blockIfBlocked;