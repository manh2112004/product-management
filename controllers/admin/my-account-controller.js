const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
const md5 = require("md5");
// [GET]/admin/my-account
module.exports.index = async (req, res) => {
  res.render("admin/pages/my-account/index.pug", {
    pageTitle: "Thông tin cá nhân",
  });
};
// [GET]/admin/my-account/edit
module.exports.edit = async (req, res) => {
  res.render("admin/pages/my-account/edit.pug", {
    pageTitle: "Chỉnh sửa thông tin cá nhân",
  });
};
// [PATCH]/admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user.id;
  const emailExits = await Account.findOne({
    _id: { $ne: id }, //ko kiểm tra id hiện tại
    email: req.body.email,
    deleted: false,
  });
  if (emailExits) {
    req.flash("error", "Email đã tồn tại");
    res.redirect(`${systemConfig.prefixAdmin}/my-account/edit`);
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password; //nếu ko điền password thì xoá bỏ để đỡ update trong db
    }
    await Account.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật thành công");
  }
  res.redirect(`${systemConfig.prefixAdmin}/my-account/edit`);
};
