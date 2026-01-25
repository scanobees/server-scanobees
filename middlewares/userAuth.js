import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";


export const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
    req.user = await userModel.findById(decoded.userId).select("-password");
    // console.log("decode:",decoded);
    // console.log("req.user",req.user);
    
    
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
