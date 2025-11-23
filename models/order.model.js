const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    cart_id: String,
    userInfo: {
      fullName: String,
      phone: String,
      address: String,
    },
    products: [
      {
        product_id: String,
        price: Number,
        quantity: Number,
        discountPercentage: Number,
      },
    ],
    status: {
      type: String,
      default: "unconfirmed",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema, "orders");
module.exports = Order;
