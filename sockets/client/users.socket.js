const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");
module.exports = (res) => {
  _io.once("connection", (socket) => {
    socket.on("CLIENT_ADD_FRIEND", async (userID) => {
      const myUserID = res.locals.user.id;
      //   console.log(myUserID); //id của người gửi
      //   console.log(userID); //id của người nhận
      //thêm id của A(bản thân) vào acceptFriends của B
      const existIdAinB = await User.findOne({
        _id: userID,
        acceptFriends: myUserID,
      });
      if (!existIdAinB) {
        await User.updateOne(
          {
            _id: userID,
          },
          {
            $push: { acceptFriends: myUserID },
          }
        );
      }
      //thêm id của B vào requestFriends của A(bản thân)
      const existIdBinA = await User.findOne({
        _id: myUserID,
        requestFriends: userID,
      });
      if (!existIdBinA) {
        await User.updateOne(
          {
            _id: myUserID,
          },
          {
            $push: { requestFriends: userID },
          }
        );
      }
      // lấy ra độ dài acceptFriends của B và trả về cho B
      const infoUser = await User.findOne({
        _id: userID,
      });
      const lengthAcceptFriends = infoUser.acceptFriends.length;
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
        userID: userID,
        lengthAcceptFriends: lengthAcceptFriends,
      });
      // lấy info của A trả về cho B
      const infoUserA = await User.findOne({
        _id: myUserID,
      }).select("id avatar fullName");
      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIENDS", {
        userID: userID,
        infoUserA: infoUserA,
      });
    });
    socket.on("CLIENT_CANCEL_FRIEND", async (userID) => {
      const myUserID = res.locals.user.id;
      //   console.log(myUserID); //id của người gửi
      //   console.log(userID); //id của người nhận
      //xoá id của A(bản thân) trong acceptFriends của B
      const existIdAinB = await User.findOne({
        _id: userID,
        acceptFriends: myUserID,
      });
      if (existIdAinB) {
        await User.updateOne(
          {
            _id: userID,
          },
          {
            $pull: { acceptFriends: myUserID },
          }
        );
      }
      //xoá id của B trong requestFriends của A(bản thân)
      const existIdBinA = await User.findOne({
        _id: myUserID,
        requestFriends: userID,
      });
      if (existIdBinA) {
        await User.updateOne(
          {
            _id: myUserID,
          },
          {
            $pull: { requestFriends: userID },
          }
        );
      }
      // lấy ra độ dài acceptFriends của B và trả về cho B
      const infoUser = await User.findOne({
        _id: userID,
      });
      const lengthAcceptFriends = infoUser.acceptFriends.length;
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", {
        userID: userID,
        lengthAcceptFriends: lengthAcceptFriends,
      });
      // lấy id của A và trả về cho B
      socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIENDS", {
        userIdB: userID,
        userIdA: myUserID,
      });
    });
    socket.on("CLIENT_REFUSE_FRIEND", async (userID) => {
      const myUserID = res.locals.user.id;
      //   console.log(myUserID); //id của người nhận
      //   console.log(userID); //id của người gửi
      //xoá id của A(bản thân) trong acceptFriends của B
      const existIdAinB = await User.findOne({
        _id: myUserID,
        acceptFriends: userID,
      });
      if (existIdAinB) {
        await User.updateOne(
          {
            _id: myUserID,
          },
          {
            $pull: { acceptFriends: userID },
          }
        );
      }
      //xoá id của B trong requestFriends của A(bản thân)
      const existIdBinA = await User.findOne({
        _id: userID,
        requestFriends: myUserID,
      });
      if (existIdBinA) {
        await User.updateOne(
          {
            _id: userID,
          },
          {
            $pull: { requestFriends: myUserID },
          }
        );
      }
    });
    socket.on("CLIENT_ACCEPT_FRIEND", async (userID) => {
      const myUserID = res.locals.user.id;
      //   console.log(myUserID); //id của người nhận
      //   console.log(userID); //id của người gửi

      const existIdAinB = await User.findOne({
        _id: myUserID,
        acceptFriends: userID,
      });
      const existIdBinA = await User.findOne({
        _id: userID,
        requestFriends: myUserID,
      });

      // Tạo phòng chat chung
      let roomChat;
      if (existIdAinB && existIdBinA) {
        const dataRoom = {
          typeRoom: "friend",
          status: String,
          users: [
            {
              user_id: userID,
              role: "supperAdmin",
            },
            {
              user_id: myUserID,
              role: "supperAdmin",
            },
          ],
        };
        roomChat = new RoomChat(dataRoom);
        await roomChat.save();
      }
      // End tạo phòng chat chung

      //xoá id của A(bản thân) trong acceptFriends của B
      // thêm {user_id,room_chat_id} của A vào friendList của B
      if (existIdAinB) {
        await User.updateOne(
          {
            _id: myUserID,
          },
          {
            $push: {
              friendList: {
                user_id: userID,
                room_chat_id: roomChat.id,
              },
            },
            $pull: { acceptFriends: userID },
          }
        );
      }
      //xoá id của B trong requestFriends của A(bản thân)
      // thêm {user_id,room_chat_id} của B vào friendList của A
      if (existIdBinA) {
        await User.updateOne(
          {
            _id: userID,
          },
          {
            $push: {
              friendList: {
                user_id: myUserID,
                room_chat_id: roomChat.id,
              },
            },
            $pull: { requestFriends: myUserID },
          }
        );
      }
    });
  });
};
