import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";
// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      e.target.elements.content.value = "";
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }
  });
}
// END CLIENT_SEND_MESSAGE
// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myID = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");
  const boxTyping = document.querySelector(".chat .inner-list-typing");
  const div = document.createElement("div");
  let htmlFullName = "";
  if (myID == data.userID) {
    div.classList.add("inner-outgoing");
  } else {
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    div.classList.add("inner-incoming");
  }
  div.innerHTML = `
      ${htmlFullName}
      <div class="inner-content">${data.content}</div>
  `;
  body.insertBefore(div, boxTyping);
  body.scrollTop = chatBody.scrollHeight;
});
// end SERVER_RETURN_MESSAGE
// scroll chat to bottom
const chatBody = document.querySelector(".chat .inner-body");
chatBody.scrollTop = chatBody.scrollHeight;
//end scroll chat to bottom
// show icon chat
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);
  buttonIcon.addEventListener("click", (e) => {
    tooltip.classList.toggle("show");
  });
}
// end show icon chat
var timeOut;
const showTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", "show");
  clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hidden");
  }, 3000);
};
// insert icon to input
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  const inputChat = document.querySelector(
    ".chat .inner-form input[name='content']"
  );
  emojiPicker.addEventListener("emoji-click", (e) => {
    const icon = e.detail.unicode;
    inputChat.value += icon;
    inputChat.setSelectionRange(inputChat.value.length, inputChat.value.length);
    inputChat.focus();
    showTyping();
  });
  // input keyup
  inputChat.addEventListener("keyup", () => {
    socket.emit("CLIENT_SEND_TYPING", "show");
    showTyping();
  });
  // end input keyup
}
// end insert icon to input
// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    if (data.type == "show") {
      const chatBody = document.querySelector(".chat .inner-body");
      const existTyping = elementListTyping.querySelector(
        `[user-id="${data.userID}"]`
      );
      if (!existTyping) {
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userID);
        boxTyping.innerHTML = `
       <div class="inner-name">Le van a</div>
       <div class="inner-dots">
           <span></span>
           <span></span>
           <span></span>
       </div>
      `;
        elementListTyping.appendChild(boxTyping);
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    } else {
      const boxTypingRemove = elementListTyping.querySelector(
        `[user-id="${data.userID}"]`
      );
      if (boxTypingRemove) {
        elementListTyping.removeChild(boxTypingRemove);
      }
    }
  });
}
// END SERVER_RETURN_TYPING
