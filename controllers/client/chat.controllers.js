const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
// [GET] /chat
module.exports.index = async (req, res) => {
  const userID = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  // socketIO
  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      // lưu vào db
      const chat = new Chat({
        user_id: userID,
        content: content,
      });
      await chat.save();
      // trả data về cho client
      _io.emit("SERVER_RETURN_MESSAGE", {
        userID: userID,
        fullName: fullName,
        content: chat.content,
      });
    });
    // typing
    socket.on("CLIENT_SEND_TYPING", async (type) => {
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        userID: userID,
        fullName: fullName,
        type: type,
      });
    });
    // end typing
  });
  // end socketIO
  // lấy data từ db
  const chats = await Chat.find({
    deleted: false,
  });
  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id,
    }).select("fullName");
    chat.infoUser = infoUser;
  }
  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats,
  });
};
