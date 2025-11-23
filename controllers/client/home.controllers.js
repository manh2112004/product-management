const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");
const UserHistory = require("../../models/userHistory.model");
const paginationHelpers = require("../../helpers/pagination");
// [GET] /
module.exports.index = async (req, res) => {
  const userId = res.locals.user ? res.locals.user.id : null;
  let recommendedProducts = [];
  if (userId) {
    const viewed = await UserHistory.aggregate([
      {
        $match: { user_id: userId, action: "view", product_id: { $ne: null } },
      },
      { $group: { _id: "$product_id", total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]);
    const viewedIds = viewed.map((item) => item._id);
    const productViewed = await Product.find({
      _id: { $in: viewedIds },
    });
    const categories = productViewed.map((p) => p.category_id);
    recommendedProducts = await Product.find({
      category_id: { $in: categories },
      _id: { $nin: viewedIds },
      deleted: false,
    }).limit(8);
  }
  let find = {
    deleted: false,
    status: "active",
  };
  // sản phẩm nổi bật
  const productFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  });
  const newProductsFeatured = productHelper.priceNewProducts(productFeatured);
  //kết thúc sản phẩm nổi bật
  const countProducts = await Product.countDocuments(find);
  let objectPagination = {
    currentPage: 1,
    limitItem: 8,
  };
  paginationHelpers(objectPagination, req.query, countProducts);
  // sản phẩm mới nhất
  const productNew = await Product.find(find)
    .sort({ createdAt: "desc" })
    .limit(8)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);
  const productNewPrice = productHelper.priceNewProducts(productNew);
  // kết thúc sản phẩm mới nhất
  res.render("client/pages/home/index.pug", {
    pageTitle: "Trang Chủ",
    productFeatured: newProductsFeatured,
    productNewPrice: productNewPrice,
    pagination: objectPagination,
    productRecommend: recommendedProducts,
  });
};
