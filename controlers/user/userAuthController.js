import bcrypt from "bcrypt";
import userModel from "../../models/userModel.js";
import { generateToken } from "../../utils/token.js";
import admin from "../../config/firebase-admin.js";

/* ─────────────────────────────
   COOKIE OPTIONS (GLOBAL)
───────────────────────────── */
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  domain: ".scanobees.com",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

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

/* ─────────────────────────────
   GOOGLE OAUTH (FIREBASE TOKEN)
───────────────────────────── */
export const googleAuth = async (req, res) => {
  console.log("🟡 [GOOGLE AUTH] Request received");

  const { idToken } = req.body;

  console.log("🟡 [GOOGLE AUTH] idToken exists:", !!idToken);

  if (!idToken) {
    console.log("🔴 [GOOGLE AUTH] Missing ID Token");
    return res
      .status(400)
      .json({ success: false, message: "Firebase ID Token required" });
  }

  try {
    console.log("🟡 [GOOGLE AUTH] Verifying ID token...");

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    console.log("🟢 [GOOGLE AUTH] Token verified");
    console.log("🟢 [GOOGLE AUTH] Token AUD:", decodedToken.aud);
    console.log("🟢 [GOOGLE AUTH] Token EMAIL:", decodedToken.email);

    const { email, name } = decodedToken;

    let user = await userModel.findOne({ email });
    console.log("🟡 [GOOGLE AUTH] User exists:", !!user);

    if (!user) {
      console.log("🟡 [GOOGLE AUTH] Creating new user");
      user = await userModel.create({
        email,
        name,
        loginProvider: "google",
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user._id);
    console.log("🟢 [GOOGLE AUTH] JWT generated");

    res.cookie("token", token, cookieOptions);
    console.log("🟢 [GOOGLE AUTH] Cookie set");

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("🔴 [GOOGLE AUTH ERROR]");
    console.error("🔴 Message:", error.message);
    console.error("🔴 Code:", error.code);
    console.error("🔴 Full Error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired Google token",
    });
  }
};

/* ─────────────────────────────
   LOGOUT
───────────────────────────── */
export const userLogout = (req, res) => {
  res.clearCookie("token", {
    ...cookieOptions,
    maxAge: 0,
  });

  res.json({ message: "Logged out successfully" });
};

/* ─────────────────────────────
   GET CURRENT USER
───────────────────────────── */
export const checkUser = async (req, res) => {
  res.json(req.user);
};
