// showAlert
const showAlert = document.querySelector("[showAlert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time")) || 3000;
  const closeAlert = showAlert.querySelector("[close-alert]");
  setTimeout(() => {
    showAlert.classList.add("alertHidden");
    setTimeout(() => showAlert.remove(), 500);
  }, time);

  // Khi người dùng click nút X
  if (closeAlert) {
    closeAlert.addEventListener("click", () => {
      showAlert.classList.add("alertHidden");
      setTimeout(() => showAlert.remove(), 300);
    });
  }
}
// end showAlert

