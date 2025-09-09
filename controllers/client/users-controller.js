const User = require("../../models/user.model");
const usersSocket = require("../../sockets/client/users.socket");
// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  usersSocket(res);
  const userID = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userID,
  });
  const requestFiends = myUser.requestFriends;
  const acceptFiends = myUser.acceptFriends;
  const friendList = myUser.friendList;
  const friendListID = friendList.map((item) => item.user_id);
  const users = await User.find({
    $and: [
      { _id: { $ne: userID } }, //trừ chủ tài khoản
      { _id: { $nin: requestFiends } }, //trừ những người đã ấn gửi kb
      { _id: { $nin: acceptFiends } }, //trừ những người đã gửi kb cho chủ tài khoản
      { _id: { $nin: friendListID } }, //trừ những người đã kết bạn
    ],
    deleted: false,
    status: "active",
  }).select("id avatar fullName");
  res.render("client/pages/users/not-friend.pug", {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
};
// [GET] /users/request
module.exports.request = async (req, res) => {
  usersSocket(res);
  const userID = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userID,
  });
  const requestFiends = myUser.requestFriends;
  const users = await User.find({
    _id: { $in: requestFiends },
    deleted: false,
    status: "active",
  }).select("id avatar fullName");
  res.render("client/pages/users/request.pug", {
    pageTitle: "Lời mời kết bạn đã gửi",
    users: users,
  });
};
// [GET] /users/accept
module.exports.accept = async (req, res) => {
  usersSocket(res);
  const userID = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userID,
  });
  const acceptFriends = myUser.acceptFriends;
  const users = await User.find({
    _id: { $in: acceptFriends },
    deleted: false,
    status: "active",
  }).select("id avatar fullName");
  res.render("client/pages/users/accept.pug", {
    pageTitle: "Lời mời đã nhận",
    users: users,
  });
};
// [GET] /users/friends
module.exports.friends = async (req, res) => {
  usersSocket(res);
  const userID = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userID,
  });
  const friendList = myUser.friendList;
  const friendListID = friendList.map((item) => item.user_id);
  const users = await User.find({
    _id: { $in: friendListID },
    deleted: false,
    status: "active",
  }).select("id avatar fullName statusOnline");
  for (const user of users) {
    const infoFriend = friendList.find((friend) => friend.user_id == user.id);
    user.infoFriend = infoFriend;
  }
  res.render("client/pages/users/friends.pug", {
    pageTitle: "Danh sách bạn bè",
    users: users,
  });
};
