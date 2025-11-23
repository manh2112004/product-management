const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");
const Order = require("../../models/order.model");
// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
  const statistic = {
    categoryProduct: {
      total: 5,
      active: 3,
      inactive: 2,
    },
    product: {
      total: 5,
      active: 3,
      inactive: 2,
    },
    account: {
      total: 5,
      active: 3,
      inactive: 2,
    },
    user: {
      total: 5,
      active: 3,
      inactive: 2,
    },
    order: { total: 0, confirm: 0, unconfirmed: 0 },
  };
  statistic.categoryProduct.total = await ProductCategory.countDocuments({
    deleted: false,
  });
  statistic.categoryProduct.active = await ProductCategory.countDocuments({
    deleted: false,
    status: "active",
  });
  statistic.categoryProduct.inactive = await ProductCategory.countDocuments({
    deleted: false,
    status: "inactive",
  });
  statistic.product.total = await Product.countDocuments({
    deleted: false,
  });
  statistic.product.active = await Product.countDocuments({
    deleted: false,
    status: "active",
  });
  statistic.product.inactive = await Product.countDocuments({
    deleted: false,
    status: "inactive",
  });
  statistic.account.total = await Account.countDocuments({
    deleted: false,
  });
  statistic.account.active = await Account.countDocuments({
    deleted: false,
    status: "active",
  });
  statistic.account.inactive = await Account.countDocuments({
    deleted: false,
    status: "inactive",
  });
  statistic.user.total = await User.countDocuments({
    deleted: false,
  });
  statistic.user.active = await User.countDocuments({
    deleted: false,
    status: "active",
  });
  statistic.user.inactive = await User.countDocuments({
    deleted: false,
    status: "inactive",
  });
  statistic.order.total = await Order.countDocuments({ deleted: false });
  statistic.order.confirm = await Order.countDocuments({
    deleted: false,
    status: "confirm",
  });
  statistic.order.unconfirmed = await Order.countDocuments({
    deleted: false,
    status: "unconfirmed",
  });
  res.render("admin/pages/dashboard/index.pug", {
    pageTitle: "Trang tổng quan",
    statistic: statistic,
  });
};
