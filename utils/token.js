import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRETKEY,
    { expiresIn: "15d" }
  );
};
