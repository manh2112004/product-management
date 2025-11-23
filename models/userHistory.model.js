
const mongoose = require("mongoose");
const userHistorySchema = new mongoose.Schema(
  {
    user_id: String,
    product_id: String,
    action: { type: String, enum: ["view", "search"], default: "view" },
    keyword: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const UserHistory = mongoose.model(
  "UserHistory",
  userHistorySchema,
  "user_history"
);
module.exports = UserHistory;
