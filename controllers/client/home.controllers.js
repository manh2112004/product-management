const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");
// [GET] /
module.exports.index = async (req, res) => {
  // sản phẩm nổi bật
  const productFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  });
  const newProductsFeatured = productHelper.priceNewProducts(productFeatured);
  //kết thúc sản phẩm nổi bật
  // sản phẩm mới nhất
  const productNew = await Product.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(8);
  const productNewPrice = productHelper.priceNewProducts(productNew);
  // kết thúc sản phẩm mới nhất
  res.render("client/pages/home/index.pug", {
    pageTitle: "Trang Chủ",
    productFeatured: newProductsFeatured,
    productNewPrice: productNewPrice,
  });
};
