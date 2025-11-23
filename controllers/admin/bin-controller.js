const Products = require("../../models/product.model");
const Accounts = require("../../models/account.model");
const Orders = require("../../models/order.model");
const searchNameHelpers = require("../../helpers/searchName");
const paginationHelpers = require("../../helpers/pagination");
module.exports.binProduct = async (req, res) => {
  const find = {
    deleted: true,
  };
  const objectSearch = searchNameHelpers(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  const countProducts = await Products.countDocuments(find);
  let objectPagination = {
    currentPage: 1,
    limitItem: 5,
  };
  paginationHelpers(objectPagination, req.query, countProducts);
  const products = await Products.find(find)
    .select("-description -updatedAt -updatedBy -position")
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItem);
  const listID = products.map((product) => {
    return product.deletedBy.account_id;
  });
  const accountList = await Accounts.find({ _id: { $in: listID } })
    .select("fullName _id")
    .lean();
  const accountMap = {};
  accountList.forEach((a) => {
    accountMap[a._id.toString()] = a.fullName;
  });
  products.forEach((p) => {
    if (p.deletedBy && p.deletedBy.account_id) {
      p.deletedBy.fullName =
        accountMap[p.deletedBy.account_id.toString()] || "chưa rõ";
    }
  });
  res.render("admin/pages/bin/product.pug", {
    deletedProducts: products,
    pageTitle: "Trang sản phẩm đã xoá",
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};
module.exports.binOrders = async (req, res) => {
  const find = {
    deleted: true,
  };
  const objectSearch = searchNameHelpers(req.query);
  if (objectSearch.regex) {
    find.$or = [
      { "userInfo.fullName": objectSearch.regex },
      { "userInfo.phone": objectSearch.regex },
    ];
  }
  const countOrder = await Orders.countDocuments(find);
  let objectPagination = {
    currentPage: 1,
    limitItem: 5,
  };
  paginationHelpers(objectPagination, req.query, countOrder);
  const orders = await Orders.find(find)
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItem)
    .lean();
  for (const order of orders) {
    if (order.products && order.products.length > 0) {
      for (const p of order.products) {
        const product = await Products.findById(p.product_id)
          .select("title")
          .lean();
        p.productName = product ? product.title : "sản phẩm ko tồn tại";
      }
    }
  }
  res.render("admin/pages/bin/order.pug", {
    pageTitle: "Trang đơn hàng đã bị huỷ",
    deletedOrders: orders,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};
module.exports.restoreOrder = async (req, res) => {
  try {
    const id = req.params.id;
    await Orders.updateOne({ _id: id }, { deleted: false });
    res.json({
      code: 200,
      message: "khôi phục thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "khôi phục không thành công",
    });
  }
};
module.exports.deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    await Orders.deleteOne({ _id: id });
    res.json({
      code: 200,
      message: "Xoá đơn hàng thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Xoá đơn hàng không thành công",
    });
  }
};
module.exports.restoreProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await Products.updateOne({ _id: id }, { deleted: false });
    res.json({
      code: 200,
      message: "Khôi phục thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Khôi phục không thành công",
    });
  }
};
module.exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await Products.deleteOne({ _id: id });
    res.json({
      code: 200,
      message: "Xoá sản phẩm thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Xoá sản phẩm không thành công",
    });
  }
};
