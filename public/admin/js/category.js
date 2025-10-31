// change-status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus) {
  buttonChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const dataStatus = button.getAttribute("data-status");
      const idStatus = button.getAttribute("data-id");
      const link = `/admin/products-category/changeStatus/${idStatus}/${dataStatus}`;
      const option = {
        method: "PATCH",
      };
      fetch(link, option)
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 200) {
            button.setAttribute("data-status", data.status);
            updateButtonUI(button, data.status);
            document
              .querySelectorAll(`[data-parent-id="${idStatus}"]`)
              .forEach((childBtn) => {
                childBtn.setAttribute("data-status", data.status);
                updateButtonUI(childBtn, data.status);
              });
          } else {
            alert("cập nhật trạng thái thất bại");
          }
        });
    });
  });
}
function updateButtonUI(button, status) {
  if (status === "active") {
    button.classList.remove("bg-danger");
    button.classList.add("bg-success");
    button.innerHTML = `<i class="fa-solid fa-circle-check me-1"></i> Hoạt động`;
  } else {
    button.classList.remove("bg-success");
    button.classList.add("bg-danger");
    button.innerHTML = `<i class="fa-solid fa-circle-xmark me-1"></i> Dừng hoạt động`;
  }
}
// end change-status
// delete
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete) {
  buttonDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      const link = `/admin/products-category/delete/${id}`;
      const confirmDelete = confirm(
        "Bạn có chắc chắn muốn xóa danh mục này không?"
      );
      if (!confirmDelete) return;
      const option = {
        method: "GET",
      };
      fetch(link, option)
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 200) {
            alert(data.message);
            const tr = button.closest("tr");
            if (tr) tr.remove();
          } else {
            alert("Xóa thất bại, vui lòng thử lại!");
          }
        });
    });
  });
}
// end delete
