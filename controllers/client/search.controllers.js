const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");
const UserHistory = require("../../models/userHistory.model");
// [GET] /search
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;
  let newProducts = [];
  if (keyword) {
    const userId = res.locals.user?._id;
    if (userId) {
      await UserHistory.create({
        user_id: userId,
        action: "search",
        keyword: keyword,
      });
    }
    const regex = new RegExp(keyword, "i");
    const products = await Product.find({
      status: "active",
      deleted: false,
      title: regex,
    });
    newProducts = productHelper.priceNewProducts(products);
  }
  res.render("client/pages/search/index.pug", {
    pageTitle: "Kết quả tìm kiếm",
    keyword: keyword,
    products: newProducts,
  });
};
