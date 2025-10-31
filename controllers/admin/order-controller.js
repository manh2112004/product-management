const Orders = require("../../models/order.model");
const Products = require("../../models/product.model");
const paginationHelpers = require("../../helpers/pagination");
const searchNameHelpers = require("../../helpers/searchName");
const Order = require("../../models/order.model");
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };
  const countOrders = await Orders.countDocuments(find);
  const objectPagination = {
    currentPage: 1,
    limitItem: 5,
  };
  const objectSearch = searchNameHelpers(req.query);
  if (objectSearch.regex) {
    find.$or = [
      { "userInfo.phone": objectSearch.regex },
      { "userInfo.fullName": objectSearch.regex },
    ];
  }
  paginationHelpers(objectPagination, req.query, countOrders);
  const orders = await Orders.find(find)
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItem);
  res.render("admin/pages/orders/index.pug", {
    pageTitle: "Quản lý đơn hàng",
    orders: orders,
    pagination: objectPagination,
    keywords: objectSearch.keyword,
  });
};
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const orderStatus = await Orders.find({ status: status });
  res.json({ status: status, orders: orderStatus });
};
module.exports.confirmOrder = async (req, res) => {
  const orderId = req.params.id;
  await Orders.updateOne({ _id: orderId }, { status: "confirm" });
  res.json({
    code: 200,
    message: "Đã xác nhận đơn hàng",
    status: "confirm",
  });
};
module.exports.detail = async (req, res) => {
  const id = req.params.id;
  const orders = await Orders.findOne({
    _id: id,
    deleted: false,
  }).lean();
  const productIds = orders.products.map((p) => p.product_id);
  const productList = await Products.find({ _id: { $in: productIds } }).select(
    "title _id"
  );
  orders.products = orders.products.map((item) => {
    const product = productList.find(
      (p) => p._id.toString() === item.product_id.toString()
    );
    return {
      ...item,
      productName: product ? product.title : "Sản phẩm không tồn tại",
    };
  });
  res.render("admin/pages/orders/detail.pug", {
    pageTitle: "Chi tiết đơn hàng",
    orders: orders,
  });
};
module.exports.cancelOrder = async (req, res) => {
  const id = req.params.id;
  await Orders.updateOne(
    {
      _id: id,
    },
    {
      deleted: true,
    }
  );
  res.json({
    message: "huỷ đơn hàng thành công",
  });
};
