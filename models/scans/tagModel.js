import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    nickName: {
      type: String,
      trim: true
    },

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
        relation: String,
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
          region: String
        },
        gpsLocation: {
          lat: Number,
          lng: Number
        },
        scannedPhoneNo: String,
        userAgent: String
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

export default mongoose.model("Tag", tagSchema);
