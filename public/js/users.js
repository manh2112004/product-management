// chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("add");
      const userID = button.getAttribute("btn-add-friend");
      socket.emit("CLIENT_ADD_FRIEND", userID);
    });
  });
}
//end chức năng gửi yêu cầu
// chức năng huỷ yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.remove("add");
      const userID = button.getAttribute("btn-cancel-friend");
      socket.emit("CLIENT_CANCEL_FRIEND", userID);
    });
  });
}
//end chức năng huỷ yêu cầu
// chức năng từ chối yêu cầu
const refuseFriend = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("refuse");
    const userID = button.getAttribute("btn-refuse-friend");
    socket.emit("CLIENT_REFUSE_FRIEND", userID);
  });
};
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach((button) => {
    refuseFriend(button);
  });
}
//end chức năng từ chối yêu cầu
// chức năng chấp nhận yêu cầu
const acceptFriend = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("accepted");
    const userID = button.getAttribute("btn-accept-friend");
    socket.emit("CLIENT_ACCEPT_FRIEND", userID);
  });
};
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach((button) => {
    acceptFriend(button);
  });
}
//end chức năng chấp nhận yêu cầu
// SERVER_RETURN_LENGTH_ACCEPT_FRIENDS
const badgeUsersAccept = document.querySelector("[badge-users-accept]");
if (badgeUsersAccept) {
  const userID = badgeUsersAccept.getAttribute("badge-users-accept");
  socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIENDS", (data) => {
    if (data.userID === userID) {
      badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
    }
  });
}
// END SERVER_RETURN_LENGTH_ACCEPT_FRIENDS
// SERVER_RETURN_INFO_ACCEPT_FRIENDS
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIENDS", (data) => {
  // trang lời mời đã nhận
  const dataUserAccept = document.querySelector("[data-user-accept]");
  if (dataUserAccept) {
    const userID = dataUserAccept.getAttribute("data-user-accept");
    if (userID == data.userID) {
      // vẽ user ra giao diện
      const div = document.createElement("div");
      div.classList.add("col-6");
      div.setAttribute("user-id", data.infoUserA._id);
      div.innerHTML = `
          <div class="box-user">
              <div class="inner-avatar">
                  <img
                      src="${
                        data.infoUserA.avatar
                          ? data.infoUserA.avatar
                          : "https://th.bing.com/th/id/OIP.kQyrx9VbuWXWxCVxoreXOgHaHN?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"
                      }"
                      alt=""
                  >
              </div>
              <div class="inner-info">
                  <div class="inner-name">${data.infoUserA.fullName}</div>
                  <div class="inner-buttons">
                      <button
                          class="btn btn-sm btn-primary mr-1"
                          btn-accept-friend="${data.infoUserA._id}"
                      >
                          Chấp nhận
                      </button>
                      <button
                          class="btn btn-sm btn-secondary mr-1"
                          btn-refuse-friend="${data.infoUserA._id}"
                      >
                          Xoá
                      </button>
                      <button
                          class="btn btn-sm btn-secondary mr-1"
                          btn-deleted-friend="{{ user.id }}"
                          disabled
                      >
                          đã xoá
                      </button>
                      <button
                          class="btn btn-sm btn-primary mr-1"
                          btn-accepted-friend="{{ user.id }}"
                          disabled
                      >
                          đã chấp nhận
                      </button>
                  </div>
              </div>
          </div>
      `;
      dataUserAccept.appendChild(div);
      //end vẽ user ra giao diện

      //huỷ lời mời kết bạn
      const buttonRefuse = div.querySelector("[btn-refuse-friend]");
      refuseFriend(buttonRefuse);
      // end huỷ lời mời kết bạn

      // chấp nhận lời mời kb
      const buttonAccept = div.querySelector("[btn-accept-friend]");
      acceptFriend(buttonAccept);
      //end chấp nhận lời mời kb
    }
  }
  // trang danh sách người dùng
  const dataUsersNotFriend = document.querySelector("[data-user-not-friend]");
  if (dataUsersNotFriend) {
    const userID = dataUsersNotFriend.getAttribute("data-user-not-friend");
    if (userID == data.userID) {
      const userIdA = data.infoUserA._id;
      const boxUserRemove = dataUsersNotFriend.querySelector(
        `[user-id='${userIdA}']`
      );
      if (boxUserRemove) {
        dataUsersNotFriend.removeChild(boxUserRemove);
      }
    }
  }
});
// END SERVER_RETURN_INFO_ACCEPT_FRIENDS
// SERVER_RETURN_USER_ID_CANCEL_FRIENDS
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIENDS", (data) => {
  const userIdA = data.userIdA;
  const boxUserRemove = document.querySelector(`[user-id='${userIdA}']`);
  if (boxUserRemove) {
    const dataUserAccept = document.querySelector("[data-user-accept]");
    const userIdB = badgeUsersAccept.getAttribute("badge-users-accept");
    if (userIdB == data.userIdB) {
      dataUserAccept.removeChild(boxUserRemove);
    }
  }
});
// END SERVER_RETURN_USER_ID_CANCEL_FRIENDS
// SERVER_RETURN_USER_ONLINE
socket.on("SERVER_RETURN_USER_STATUS_ONLINE", (data) => {
  const dataUserFriend = document.querySelector("[data-user-friend]");
  if (dataUserFriend) {
    const boxUser = dataUserFriend.querySelector(`[user-id="${data.userID}"]`);
    if (boxUser) {
      const boxStatus = boxUser.querySelector("[status]");
      boxStatus.setAttribute("status", data.status);
    }
  }
});
// END SERVER_RETURN_USER_ONLINE
