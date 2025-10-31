// chang status
const buttonStatusUsers = document.querySelectorAll("[button-change-status]");
if (buttonStatusUsers) {
  buttonStatusUsers.forEach((button) => {
    button.addEventListener("click", () => {
      const dataStatus = button.getAttribute("data-status");
      const userId = button.getAttribute("data-id");
      const link = `/admin/UserAccount/changeStatus/${userId}/${dataStatus}`;
      const option = {
        method: "PATCH",
      };
      fetch(link, option)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "active") {
            button.classList.remove("bg-danger");
            button.classList.add("bg-success");
            button.innerHTML = `<i class="fa-solid fa-circle-check me-1"></i> Hoạt động`;
            button.setAttribute("data-status", "active");
          } else {
            button.classList.remove("bg-success");
            button.classList.add("bg-danger");
            button.innerHTML = `<i class="fa-solid fa-circle-xmark me-1"></i> Dừng hoạt động`;
            button.setAttribute("data-status", "inactive");
          }
        });
    });
  });
}
// end change status
// button delete
const buttonDeleteUsers = document.querySelectorAll("[button-delete]");
if (buttonDeleteUsers) {
  buttonDeleteUsers.forEach((button) => {
    button.addEventListener("click", () => {
      const userId = button.getAttribute("data-id");
      const link = `/admin/UserAccount/delete/${userId}`;
      const option = {
        method: "DELETE",
      };
      if (!confirm("Bạn có chắc muốn xoá người dùng này không?")) return;
      fetch(link, option)
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 200) {
            const row = button.closest("tr");
            row.classList.add("table-danger");
            setTimeout(() => {
              row.remove();
            }, 300);
            const alertBox = document.createElement("div");
            alertBox.className = "alert alert-success mt-3";
            alertBox.innerText = data.message || "Xoá người dùng thành công!";
            document.querySelector(".card-body.p-0").prepend(alertBox);
            setTimeout(() => {
              alertBox.remove();
            }, 3000);
          } else {
            alert("Xoá thất bại: " + data.message);
          }
        });
    });
  });
}
// end button delete
