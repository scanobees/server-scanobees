import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    googleId: {
    type: String,
    // index: true
  },

    password: {
    type: String,
  },

    phone: {
      countryCode: { type: String },
      number: { type: String },
      e164: { type: String }
    },

    address: {
      addressLine: String,
      city: String,
      state: String,
      pin: String,
      country: String
    },

    cars: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
    bikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bike" }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    businessCards: [{ type: mongoose.Schema.Types.ObjectId, ref: "BusinessCard" }],
    keyTags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Key" }],
    petTags: [{ type: mongoose.Schema.Types.ObjectId, ref: "PetTag" }],
    reviewCards: [{ type: mongoose.Schema.Types.ObjectId, ref: "ReviewCard" }],

    serialAll: [{ type: String, trim: true }],

    activityStatus: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active"
    },

    premium: {
      type: Boolean,
      default: false
    },

    lastLoginAt: Date,

    loginProvider: {
      type: String,
      enum: ["local","google"],
      default: "google"
    },

    isDeleted: {
      type: Boolean,
      default: false
    },

    isProfileUpdated: {
      type: Boolean,
      default: false
    },

    otp: String,

otpExpire: Date,

otpAttempts: {
  type: Number,
  default: 0,
},
otpVerified: {
  type: Boolean,
  default: false,
}
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);


