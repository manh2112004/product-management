const User = require("../../models/user.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const paginationHelpers = require("../../helpers/pagination");
const searchNameHelpers = require("../../helpers/searchName");
const md5 = require("md5");
module.exports.index = async (req, res) => {
  const find = { deleted: false };
  // Phân trang
  const countAccountUser = await User.countDocuments(find);
  const objectPagination = {
    currentPage: 1,
    limitItem: 5,
  };
  paginationHelpers(objectPagination, req.query, countAccountUser);
  // end phân trang
  const objectSearch = searchNameHelpers(req.query);
  if (req.query.keyword) {
    find.fullName = objectSearch.regex;
  }
  const accountUser = await User.find(find)
    .select("-password -token")
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);
  res.render("admin/pages/UserAccount/index.pug", {
    pageTitle: "Danh sách tài khoản User",
    accountUser: accountUser,
    pagination: objectPagination,
    keyword: objectSearch.keyword,
  });
};
module.exports.detail = async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: id }).select("-password -token");
  const acceptFriends = await User.find({
    _id: { $in: user.acceptFriends },
  }).select("fullName avatar");
  const idFriendList = user.friendList.map((item) => item.user_id);
  const friendList = await User.find({
    _id: { $in: idFriendList },
  }).select("fullName avatar");
  res.render("admin/pages/UserAccount/detail.pug", {
    pageTitle: "Chi tiết tài khoản User",
    user: user,
    acceptFriends: acceptFriends,
    friendList: friendList,
  });
};
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: id }).select("-password -token");
  res.render("admin/pages/UserAccount/edit.pug", {
    pageTitle: "Chỉnh sửa tài khoản User",
    user: user,
  });
};
module.exports.editPatch = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = req.params.id;
  const emailExits = await User.findOne({
    _id: { $ne: id }, //ko kiểm tra id hiện tại
    email: email,
    deleted: false,
  });
  if (emailExits) {
    req.flash("error", "Email đã tồn tại");
    res.redirect(`${systemConfig.prefixAdmin}/UserAccount/edit/${id}`);
  } else {
    if (password) {
      req.body.password = md5(password);
    } else {
      delete req.body.password; //nếu ko điền password thì xoá bỏ để đỡ update trong db
    }
    await User.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật thành công");
    res.redirect(`${systemConfig.prefixAdmin}/UserAccount/edit/${id}`);
  }
};
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;
    const statusChanged = status === "active" ? "inactive" : "active";
    await User.updateOne({ _id: id }, { status: statusChanged });
    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công",
      status: statusChanged,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhật trạng thái không thành công",
    });
  }
};
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await User.deleteOne({ _id: id });
    res.json({
      code: 200,
      message: "Xóa tài khoản thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Xóa tài khoản không thành công",
    });
  }
};
