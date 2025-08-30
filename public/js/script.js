// showAlert
const showAlert = document.querySelector("[showAlert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");
  console.log(close);
  setTimeout(() => {
    showAlert.classList.add("alertHidden");
  }, time);
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alertHidden");
  });
}
// end showAlert
