const User = require("../../models/user.model");
const forgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");
const md5 = require("md5");
//[GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register.pug", {
    pageTitle: "Đăng ký tài khoản",
  });
};
//[POST] /user/register
module.exports.registerPost = async (req, res) => {
  console.log(req.body);
  const existEmail = await User.findOne({
    email: req.body.email,
  });
  if (existEmail) {
    req.flash("error", "Email đã tồn tại");
    res.redirect("/user/register");
    return;
  }
  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/user/register");
};
//[GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login.pug", {
    pageTitle: "Đăng nhập tài khoản",
  });
};
//[POST] /user/register
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "email ko tồn tại");
    res.redirect("/user/login");
  }
  if (md5(password) != user.password) {
    req.flash("error", "sai mật khẩu");
    res.redirect("/user/login");
  }
  if (user.status != "active") {
    req.flash("error", "tài khoản đang bị khoá");
    res.redirect("/user/login");
  }
  const cart = await Cart.findOne({
    user_id: user.id,
  });
  if (cart) {
    res.cookie("userID", user.id);
  } else {
    await Cart.updateOne(
      {
        _id: req.cookies.cartID,
      },
      {
        user_id: user.id,
      }
    );
  }
  res.cookie("tokenUser", user.tokenUser);
  await User.updateOne(
    {
      tokenUser: user.tokenUser,
    },
    {
      statusOnline: "online",
    }
  );
  _io.once("connection", (socket) => {
    socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
      userID: user.id,
      status: "online",
    });
  });
  res.redirect("/");
};
//[GET] /user/logout
module.exports.logout = async (req, res) => {
  await User.updateOne(
    {
      tokenUser: req.cookies.tokenUser,
    },
    {
      statusOnline: "offline",
    }
  );
  _io.once("connection", (socket) => {
    socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
      userID: res.locals.user.id,
      status: "offline",
    });
  });
  res.clearCookie("tokenUser");
  res.clearCookie("cartID");
  res.redirect("/user/login");
};
//[GET] /user/forgot-password
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password.pug", {
    pageTitle: "Quên mật khẩu",
  });
};
//[GET] /user/forgot-password
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect("/user/password/forgot");
    return;
  }
  //  Lưu thông tin vào DB
  const otp = generateHelper.generateRandomNumber(6);
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now(),
  };
  const ForgotPassword = new forgotPassword(objectForgotPassword);
  await ForgotPassword.save();
  res.redirect(`/user/password/otp?email=${email}`);
  // nếu tồn tại email thì gửi mã OTP qua email
  const subject = "Mã OTP xác minh lấy lại mật khẩu";
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 500px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      padding: 20px 30px;
    }
    h2 {
      color: #333;
      text-align: center;
    }
    .otp-box {
      margin: 20px auto;
      background: #f0f8ff;
      border: 2px dashed #007bff;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
      letter-spacing: 4px;
    }
    p {
      font-size: 14px;
      color: #555;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Xác minh lấy lại mật khẩu</h2>
    <p>Xin chào,</p>
    <p>Bạn vừa yêu cầu đặt lại mật khẩu. Đây là mã OTP của bạn:</p>
    <div class="otp-box">${otp}</div>
    <p>Mã OTP chỉ có hiệu lực trong <b>3 phút</b>. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Mạnh. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
  sendMailHelper.sendMail(email, subject, htmlContent);
};
//[GET] /user/otp/password
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/otp-password.pug", {
    pageTitle: "Xác thực OTP",
    email: email,
  });
};
//[POST] /user/otp/password
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const result = await forgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!result) {
    req.flash("error", "Mã OTP không đúng");
    res.redirect(`/user/password/otp?email=${email}`);
  }
  const user = await User.findOne({
    email: email,
  });
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/user/password/reset");
};
//[GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/reset-password.pug", {
    pageTitle: "Đặt lại mật khẩu",
    email: email,
  });
};
//[POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;
  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: md5(password),
    }
  );
  res.redirect("/");
};
//[GET] /user/info
module.exports.info = async (req, res) => {
  res.render("client/pages/user/info.pug", {
    pageTitle: "Thông tin tài khoản",
  });
};
