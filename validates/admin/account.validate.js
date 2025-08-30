const systemConfig = require("../../config/system");
module.exports.createPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", `vui lòng nhập tên`);
    res.redirect(`${systemConfig.prefixAdmin}/products/create`);
    return;
  }
  if (!req.body.email) {
    req.flash("error", `vui lòng nhập email`);
    res.redirect(`${systemConfig.prefixAdmin}/products/create`);
    return;
  }
  if (!req.body.password) {
    req.flash("error", `vui lòng nhập mật khẩu`);
    res.redirect(`${systemConfig.prefixAdmin}/products/create`);
    return;
  }
  next();
};
module.exports.editPatch = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", `vui lòng nhập tên`);
    res.redirect(`${systemConfig.prefixAdmin}/products/create`);
    return;
  }
  if (!req.body.email) {
    req.flash("error", `vui lòng nhập email`);
    res.redirect(`${systemConfig.prefixAdmin}/products/create`);
    return;
  }
  next();
};
