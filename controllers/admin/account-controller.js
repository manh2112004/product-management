const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const md5 = require("md5");
// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Account.find(find).select("-password -token");
  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });
    record.role = role;
  }
  res.render("admin/pages/accounts/index.pug", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });
};
// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/accounts/create.pug", {
    pageTitle: "Thêm tài khoản",
    roles: roles,
  });
};
// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const emailExits = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (emailExits) {
    req.flash("error", "Email đã tồn tại");
    res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  } else {
    if (!req.body.avatar) {
      req.body.avatar =
        "https://res.cloudinary.com/dnz4qb7jl/image/upload/v1754968585/avtDefault_ae1b0b.webp";
    }
    req.body.password = md5(req.body.password);
    const record = new Account(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};
// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      _id: req.params.id,
      deleted: false,
    };
    const data = await Account.findOne(find);
    const roles = await Role.find({
      deleted: false,
    });
    res.render("admin/pages/accounts/edit.pug", {
      pageTitle: "Sửa tài khoản",
      data: data,
      roles: roles,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};
// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  const emailExits = await Account.findOne({
    _id: { $ne: id },
    email: req.body.email,
    deleted: false,
  });
  if (emailExits) {
    req.flash("error", "Email đã tồn tại");
    res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    await Account.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật thành công");
  }
  res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${id}`);
};
// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  const account = await Account.findOne(
    { _id: req.params.id },
    "-password -token"
  );
  res.render("admin/pages/accounts/detail.pug", {
    pageTitle: "Chi tiết tài khoản",
    account: account,
  });
};
module.exports.deleteAccount = async (req, res) => {
  try {
    const id = req.params.id;
    await Account.updateOne({ _id: id }, { deleted: true });
    res.json({
      code: 200,
      message: "Xoá tài khoản thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Xoá tài khoản không thành công",
    });
  }
};
