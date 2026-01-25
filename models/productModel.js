import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true
    },

    slug: {
      type: String,
      unique: true
    },

    description: String,

    category: {
      type: String,
      enum: [
        "car-sticker",
        "bike-sticker",
        "qr-tag",
        "keychain",
        "business-card"
      ],
      index: true
    },

    price: {
      type: Number,
      required: true
    },

    discountPrice: Number,

    images: [String],

    stock: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    },

    customizable: {
      type: Boolean,
      default: false // pet name, phone, photo etc
    },

    metadata: {
      size: String,
      material: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
