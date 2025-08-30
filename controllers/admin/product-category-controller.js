const productCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
const filterStatusHelper = require("../../helpers/filterStatus");
// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  const find = {
    deleted: false,
  };
  // chức năng lọc theo trạng thái
  if (req.query.status) {
    find.status = req.query.status;
  }
  // end chức năng lọc theo trạng thái
  const records = await productCategory.find(find);
  const newRecords = createTreeHelper.tree(records);
  res.render("admin/pages/products-category/index.pug", {
    pageTitle: "Trang danh mục sản phẩm",
    records: newRecords,
    filterStatus: filterStatus,
  });
};
// [GET] /admin/products-category
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await productCategory.find(find);
  const newRecords = createTreeHelper.tree(records);
  res.render("admin/pages/products-category/create.pug", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: newRecords,
  });
};
// [POST] /admin/products-category/create/:
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const countProduct = await productCategory.countDocuments();
    req.body.position = countProduct + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  const record = new productCategory(req.body);
  await record.save();
  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};
// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const records = await productCategory.find({
      deleted: false,
    });
    const newRecords = createTreeHelper.tree(records);
    const data = await productCategory.findOne(find);
    res.render("admin/pages/products-category/edit.pug", {
      pageTitle: "chỉnh sửa mới sản phẩm",
      data: data,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};
// [PATCH] /admin/products-category/edit/:id
module.exports.editPath = async (req, res) => {
  const id = req.params.id;
  req.body.position = parseInt(req.body.position);
  try {
  } catch (error) {}
  await productCategory.updateOne(
    {
      _id: id,
    },
    req.body
  );
  res.redirect(`${systemConfig.prefixAdmin}/products-category/edit/${id}`);
};
