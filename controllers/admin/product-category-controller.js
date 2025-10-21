const productCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/searchName");
const { attachUserNames } = require("../../helpers/attachUserNames");
const { getSubCategory } = require("../../helpers/products-category");
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
  // chức năng tìm kiếm
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  const records = await productCategory.find(find);
  const newRecords = createTreeHelper.tree(records);
  await attachUserNames(newRecords);
  res.render("admin/pages/products-category/index.pug", {
    pageTitle: "Trang danh mục sản phẩm",
    records: newRecords,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
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
  req.body.createdBy = {
    account_id: res.locals.user.id,
    createdAt: new Date(),
  };
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
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    await productCategory.updateOne(
      {
        _id: id,
      },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );
    req.flash("success", `Cập nhật thành công`);
  } catch (error) {
    req.flash("success", `Cập nhật thất bại`);
  }
  res.redirect("back");
};
module.exports.changeStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;
    const newStatus = status === "active" ? "inactive" : "active";
    const updateBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    await productCategory.updateOne(
      { _id: id },
      { status: newStatus, $push: { updatedBy: updateBy } }
    );
    await productCategory.updateMany(
      { parent_id: id },
      { status: newStatus, $push: { updatedBy: updateBy } }
    );
    res.json({
      code: 200,
      message: "cập nhật trạng thái thành công",
      status: newStatus,
      updatedBy: updateBy,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "cập nhật trạng thái thất bại",
    });
  }
};
module.exports.detail = async (req, res) => {
  const id = req.params.id;
  const data = await productCategory.findOne({ _id: id, deleted: false });
  const lastUpdate = data.updatedBy[data.updatedBy.length - 1];
  const dataView = await productCategory
    .findOne({ _id: id, deleted: false })
    .select("-updatedBy");
  console.log(dataView);
  console.log(lastUpdate);
  res.render("admin/pages/products-category/detail.pug", {
    pageTitle: "Chi tiết danh mục sản phẩm",
    lastUpdate: lastUpdate,
    category: dataView,
  });
};
