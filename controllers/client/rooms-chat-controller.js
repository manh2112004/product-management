const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");
// [GET] /rooms-chat
module.exports.index = async (req, res) => {
  const userID = res.locals.user.id;
  const listRoomChat = await RoomChat.find({
    "users.user_id": userID,
    typeRoom: "group",
    deleted: false,
  });
  res.render("client/pages/rooms-chat/index.pug", {
    pageTitle: "Danh sách phòng",
    listRoomChat: listRoomChat,
  });
};
// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const friendList = res.locals.user.friendList;
  for (const friend of friendList) {
    const infoFriend = await User.findOne({
      _id: friend.user_id,
      deleted: false,
    }).select("fullName");
    friend.infoFriend = infoFriend;
  }
  res.render("client/pages/rooms-chat/create.pug", {
    pageTitle: "Danh sách phòng",
    friendList: friendList,
  });
};
module.exports.createPost = async (req, res) => {
  const title = req.body.title;
  const usersID = req.body.usersID;
  const dataRoom = {
    title: title,
    typeRoom: "group",
    users: [],
  };
  for (const userId of usersID) {
    dataRoom.users.push({
      user_id: userId,
      role: "user",
    });
  }
  dataRoom.users.push({
    user_id: res.locals.user.id,
    role: "supperAdmin",
  });
  console.log(dataRoom);
  const roomChat = new RoomChat(dataRoom);
  await roomChat.save();
  res.redirect(`/chat/${roomChat.id}`);
};
