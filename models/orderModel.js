const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        name: String,
        price: Number,
        quantity: Number,
        customization: {
          petName: String,
          phone: String,
          image: String
        }
      }
    ],

    subtotal: Number,
    shippingCharge: Number,
    totalAmount: Number,

    payment: {
      method: {
        type: String,
        enum: ["COD", "UPI", "CARD"]
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
      },
      transactionId: String
    },

    orderStatus: {
      type: String,
      enum: [
        "placed",
        "processing",
        "printed",
        "shipped",
        "delivered",
        "cancelled"
      ],
      default: "placed"
    },

    shippingAddress: {
      name: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
