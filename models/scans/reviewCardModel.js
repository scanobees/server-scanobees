import mongoose from "mongoose";

const reviewCardSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    shopName: { type: String, trim: true },
    category: { type: String, trim: true },

    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String
    },

    phone: {
      countryCode: String,
      number: String,
      e164: String
    },

    email: {
      type: String,
      lowercase: true,
      trim: true
    },

    website: String,

    googleReviewLink: String,

    logo: String,

    // Working Time
    workingHours: {
      days: String, 
      open: String, 
      close: String 
    },

   
    socialLinks: {
      linkedin: String,
      instagram: String,
      twitter: String,
      facebook: String,
      youtube: String
    },

   
    stores: [
      {
        name: String, 
        subtitle: String, 
        url: String
      }
    ],

    scanCount: {
      type: Number,
      default: 0
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },

    reviewFunnel: {
  enabled: { type: Boolean, default: false },
  redirectThreshold: { type: Number, default: 3 }
},

    isLinked: {
      type: Boolean,
      default: false
    },

    paused: {
      type: Boolean,
      default: false
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("ReviewCard", reviewCardSchema);