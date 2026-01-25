import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {

    serialNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    
    regNumber: {
      type: String,
      trim: true,
      uppercase: true,
      index: true
    },

    model: String,

    note: String,

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

    emergencyContacts: [
      {
        name: String,
        phone: String
      }
    ],

    scans: [
      {
        scannedAt: {
          type: Date,
          default: Date.now
        },
        ipAddress: String,
        ipLocation: {
          city: String,
          region: String,
        },
        gpsLocation: {
          lat: Number,
          lng: Number
        },
        scannedPhoneNo: String,
        userAgent: String  // device info
      }
    ],

    scanCount: {
      type: Number,
      default: 0
    },


    isLinked: {
      type: Boolean,
      default: false 
    },

    callDisabled: {
      type: Boolean,
      default: false
    },

    premium: {
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

export default mongoose.model("Car", carSchema);
