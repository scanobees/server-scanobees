import bcrypt from "bcrypt";
import userModel from "../../models/userModel.js";
import { generateToken } from "../../utils/token.js";
import admin from "../../config/firebase-admin.js";
import { generateOtp } from "../../utils/generateOtp.js";
import { sendMail } from "../../utils/sendMail.js";

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

// this cookieOptions cause no token saving in development level
// just comment these 3
 // secure: true,
  // sameSite: "none",
  // domain: ".scanobees.com",

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


  const { idToken } = req.body;


  if (!idToken) {
    return res
      .status(400)
      .json({ success: false, message: "Firebase ID Token required" });
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
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user._id);


    res.cookie("token", token, cookieOptions);
    

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
  

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



// forgot pass 
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.loginProvider !== "local") {
      return res.status(400).json({
        message: "Please login using Google",
      });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.otpAttempts = 0;
    user.otpVerified = false;

    await user.save();

    await sendMail({
      to: email,
      subject: "Reset Password OTP",
      text: `Your OTP is ${otp}. Valid for 10 minutes.`,
      html: `
        <h2>Password Reset OTP</h2>
        <h1>${otp}</h1>
        <p>Valid for 10 minutes.</p>
      `
    });

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// resend otp
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user || !user.otpExpire) {
      return res.status(400).json({ message: "No OTP request found" });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    user.otpAttempts = 0;
    user.otpVerified = false;

    await user.save();

    await sendMail({
      to: email,
      subject: "Resend OTP",
      text: `Your new OTP is ${otp}.`,
      html: `<h1>${otp}</h1>`
    });

    res.json({ message: "OTP resent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to resend OTP" });
  }
};


// verify otp
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;


    const user = await userModel.findOne({ email });

    if (!user || !user.otp || !user.otpExpire) {
      return res.status(400).json({ message: "Invalid request" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (user.otpAttempts >= 5) {
      return res.status(400).json({
        message: "Too many failed attempts",
      });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otpVerified = true;
    await user.save();

    res.json({ message: "OTP verified successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};


// reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await userModel.findOne({ email });


    if (!user || !user.otpVerified) {
      return res.status(400).json({
        message: "OTP not verified",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpire = undefined;
    user.otpAttempts = 0;
    user.otpVerified = false;

    await user.save();

    // 🔥 AUTO LOGIN
    const token = generateToken(user._id);
    res.cookie("token", token, cookieOptions);

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Password reset failed" });
  }
};