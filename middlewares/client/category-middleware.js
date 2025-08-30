const productCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree");
module.exports.category = async (req, res, next) => {
  const find = {
    deleted: false,
  };
  const productsCategory = await productCategory.find(find);
  const newProductCategory = createTreeHelper.tree(productsCategory);
  res.locals.layoutProductsCategory = newProductCategory;
  next();
};
