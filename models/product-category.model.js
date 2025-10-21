const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const productCategorySchema = new mongoose.Schema(
  {
    title: String,
    parent_id: {
      type: String,
      default: "",
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date,
      },
    ],
    deletedAt: Date,
  },
  { timestamps: true }
);
const productCategory = mongoose.model(
  "productCategory",
  productCategorySchema,
  "product-category"
);
module.exports = productCategory;
