const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");
const filterStatusHelpers = require("../../helpers/filterStatus");
const searchNameHelpers = require("../../helpers/searchName");
const paginationHelpers = require("../../helpers/pagination");
const product = require("../../models/product.model");
// [GET] /admin/products
module.exports.index = async (req, res) => {
  // chức năng lọc theo trạng thái
  const filterStatus = filterStatusHelpers(req.query);
  let find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }
  //end chức năng lọc theo trạng thái
  // chức năng tìm kiếm theo từ khoá
  const objectSearch = searchNameHelpers(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  //end chức năng tìm kiếm theo từ khoá
  // chức năng phân trang
  const countProducts = await Product.countDocuments(find);
  let objectPagination = {
    currentPage: 1,
    limitItem: 5,
  };
  paginationHelpers(objectPagination, req.query, countProducts);
  //end chức năng phân trang
  const products = await Product.find(find)
    .sort({ position: "asc" })
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);
  res.render("admin/pages/products/index.pug", {
    pageTitle: "Trang sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};
// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;
  await Product.updateOne({ _id: id }, { status: status });
  req.flash("success", "cập nhật trạng thái sản phẩm thành công");
  res.redirect(req.get("referer") || `${systemConfig.prefixAdmin}/products`);
};
// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");
  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash(
        "success",
        `cập nhật trạng thái thành công ${ids.length} sản phẩm`
      );
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash(
        "success",
        `cập nhật trạng thái thành công ${ids.length} sản phẩm`
      );
      break;
    case "deleteAll":
      await Product.updateMany(
        { _id: { $in: ids } },
        { deleted: true, deletedAt: new Date() }
      );
      req.flash("success", `xoá thành công ${ids.length} sản phẩm`);
      break;
    case "change-position":
      // console.log(ids);
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateMany({ _id: id }, { position: position });
      }
      req.flash("success", `cập nhật vị trí thành công`);
      break;
    default:
      break;
  }
  res.redirect(req.get("referer") || `${systemConfig.prefixAdmin}/products`);
};
// [DELETE] /admin/products/delete/:id
module.exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  // await Product.deleteOne({ _id: id }); //xoá vĩnh viễn
  await Product.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() }
  ); //xoá mềm vẫn còn trong db
  req.flash("success", `đã xoá sản phẩm`);
  res.redirect(req.get("referer") || `${systemConfig.prefixAdmin}/products`);
};
// [GET] /admin/products/create/:
module.exports.create = (req, res) => {
  res.render("admin/pages/products/create.pug", {
    pageTitle: "Thêm mới sản phẩm",
  });
};
// [POST] /admin/products/create/:
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  if (req.body.position == "") {
    const countProduct = await Product.countDocuments();
    req.body.position = countProduct + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  const product = new Product(req.body);
  await product.save();
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};
// [POST] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);
    console.log(product);
    res.render("admin/pages/products/edit.pug", {
      pageTitle: "chỉnh sửa mới sản phẩm",
      product: product,
    });
  } catch (error) {
    res.redirect(req.get("referer") || `${systemConfig.prefixAdmin}/products`);
  }
};
// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  try {
    await Product.updateOne(
      {
        _id: req.params.id,
      },
      req.body
    );
    req.flash("success", `Cập nhật thành công`);
  } catch (error) {
    req.flash("success", `Cập nhật thất bại`);
  }
  res.redirect("back");
};
// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);
    console.log(product);
    res.render("admin/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(req.get("referer") || `${systemConfig.prefixAdmin}/products`);
  }
};
