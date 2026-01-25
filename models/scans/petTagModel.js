import mongoose from "mongoose";

const petTagSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    // Pet Specific Info
    petName: { type: String,  trim: true },
    species: { type: String, enum: ["Dog", "Cat", "Other"] },
    breed: String,
    gender: { type: String, enum: ["Male", "Female", "Unknown"] },
    age: String,
    
    medicalInfo: {
      allergies: [String],
      medications: String,
      isNeutered: Boolean,
      microchipNumber: String
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },

    emergencyContacts: [
      {
        name: String,
        relation: { type: String, default: "Owner" },
        phone: String
      },
      {
        name: { type: String, default: "Veterinarian" },
        phone: String
      }
    ],

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
    callDisabled: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("PetTag", petTagSchema);