import bcrypt from "bcrypt";
import userModel from "../../models/userModel.js";
import { generateToken } from "../../utils/token.js";
import admin from "../../config/firebase-admin.js";

/* ─────────────────────────────
   EMAIL + PASSWORD SIGNUP
───────────────────────────── */
export const userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      loginProvider: "local",
    });

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
};

/* ─────────────────────────────
   EMAIL + PASSWORD LOGIN
───────────────────────────── */
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.loginProvider !== "local") {
      return res.status(400).json({
        message: "Please login using Google",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};




// export const userLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
// console.log(req.body);

//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     if (user.loginProvider !== "local") {
//       return res.status(400).json({
//         message: "Please login using Google"
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     user.lastLoginAt = new Date();
//     await user.save();

//     const token = generateToken(user._id);

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
//     });
// console.log(token);

//     return res.status(200).json({ message: "Login successful" });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Login failed" });
//   }
// };

/* ─────────────────────────────
   GOOGLE OAUTH CALLBACK HANDLER
───────────────────────────── */
export const googleAuthSuccess = async (req, res) => {
  try {
    const user = req.user;

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (err) {
    console.error(err);
    res.redirect(`${process.env.CLIENT_URL}/login`);
  }
};

/* ─────────────────────────────
   LOGOUT
───────────────────────────── */
export const userLogout = (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out successfully" });
};


/* ─────────────────────────────
   GET CURRENT USER
───────────────────────────── */
export const checkUser = async (req, res) => {
  res.json(req.user);
};





export const googleAuth = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({
      success: false,
      message: "Firebase ID Token is required",
    });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name } = decodedToken;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
        name,
        loginProvider: "google",
        isProfileUpdated: false,
      });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired Google token",
    });
  }
};
