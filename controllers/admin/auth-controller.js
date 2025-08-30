const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const md5 = require("md5");
// [GET] /admin/auth/login
module.exports.index = (req, res) => {
  if (req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  }
  res.render("admin/pages/auth/login.pug", {
    pageTitle: "Trang đăng nhập",
  });
};
// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await Account.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "email ko tồn tại");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    return;
  }
  if (md5(password) != user.password) {
    req.flash("error", "sai mật khẩu");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    return;
  }
  if (user.status != "active") {
    req.flash("error", "tài khoản đã bị khoá");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    return;
  }
  res.cookie("token", user.token);
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};
// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};
