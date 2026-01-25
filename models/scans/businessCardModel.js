import mongoose from "mongoose";

const businessCardSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    // Professional Details
    fullName: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    company: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    website: String,
    
    bio: String,

    socialLinks: {
      linkedin: String,
      instagram: String,
      twitter: String,
      facebook: String
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },

    phone: {
      countryCode: { type: String },
      number: { type: String },
      e164: { type: String }
    },

    // Shared Scan tracking logic
    scans: [
      {
        scannedAt: { type: Date, default: Date.now },
        ipAddress: String,
        ipLocation: { city: String, region: String },
        gpsLocation: { lat: Number, lng: Number },
        userAgent: String
      }
    ],

    scanCount: { type: Number, default: 0 },
    isLinked: { type: Boolean, default: false },
    paused: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("BusinessCard", businessCardSchema);