module.exports.registerPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash("error", `vui lòng nhập tên`);
    res.redirect(`/user/register`);
    return;
  }
  if (!req.body.email) {
    req.flash("error", `vui lòng nhập email`);
    res.redirect(`/user/register`);
    return;
  }
  if (!req.body.password) {
    req.flash("error", `vui lòng nhập mật khẩu`);
    res.redirect(`/user/register`);
    return;
  }
  next();
};
module.exports.loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", `vui lòng nhập email`);
    res.redirect(`/user/login`);
    return;
  }
  if (!req.body.password) {
    req.flash("error", `vui lòng nhập mật khẩu`);
    res.redirect(`/user/login`);
    return;
  }
  next();
};
module.exports.forgotPasswordPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash("error", `vui lòng nhập email`);
    res.redirect(`/user/password/forgot`);
    return;
  }
  next();
};
module.exports.resetPasswordPost = (req, res, next) => {
  if (!req.body.password) {
    req.flash("error", `vui lòng nhập mật khẩu`);
    res.redirect(`/user/password/reset`);
    return;
  }
  if (!req.body.confirmPassword) {
    req.flash("error", `vui xác nhận mật khẩu`);
    res.redirect(`/user/password/reset`);
    return;
  }
  if (req.body.password !== req.body.confirmPassword) {
    req.flash("error", `Mật khẩu không khớp`);
    res.redirect(`/user/password/reset`);
    return;
  }
  next();
};
