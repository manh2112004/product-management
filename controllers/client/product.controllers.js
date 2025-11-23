const Product = require("../../models/product.model");
const productCategory = require("../../models/product-category.model");
const productHelper = require("../../helpers/product");
const getSubCategoryHelper = require("../../helpers/products-category");
const paginationHelpers = require("../../helpers/pagination");
const UserHistory = require("../../models/userHistory.model");
// [GET] /products
module.exports.index = async (req, res) => {
  const activeCategories = await productCategory.find(find).select("_id");
  const products = await Product.find({
    status: "active",
    deleted: false,
    product_category_id: { $in: activeCategories.map((c) => c._id) },
  })
    .sort({ position: "desc" })
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItem);
  const newProducts = productHelper.priceNewProducts(products);
  res.render("client/pages/products/index.pug", {
    pageTitle: "Trang sản phẩm",
    products: newProducts,
  });
};
// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugProduct,
      status: "active",
    };
    const product = await Product.findOne(find);
    if (product.product_category_id) {
      const category = await productCategory.findOne({
        _id: product.product_category_id,
        status: "active",
        deleted: false,
      });
      product.category = category;
    }
    const userId = res.locals.user.id;
    if (userId) {
      await UserHistory.create({
        user_id: userId,
        product_id: product._id,
        action: "view",
      });
    }
    product.priceNew = productHelper.priceNewProduct(product);
    res.render("client/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(req.get("referer") || `/products`);
  }
};
// [GET] /products/:slug
module.exports.category = async (req, res) => {
  const category = await productCategory.findOne({
    slug: req.params.slugCategory,
    deleted: false,
  });
  const listSubCategory = await getSubCategoryHelper.getSubCategory(
    category.id
  );
  const listSubCategoryID = listSubCategory.map((item) => item.id);
  const products = await Product.find({
    product_category_id: { $in: [category.id, ...listSubCategoryID] },
    deleted: false,
  }).sort({ position: "desc" });
  const newProducts = productHelper.priceNewProducts(products);
  res.render("client/pages/products/index.pug", {
    pageTitle: category.title,
    products: newProducts,
  });
};
