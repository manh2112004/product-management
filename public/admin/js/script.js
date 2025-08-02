// button status
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
  let url = new URL(window.location.href);
  buttonStatus.forEach((button) => {
    button.addEventListener("click", () => {
      let status = button.getAttribute("button-status");
      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      window.location.href = url.href;
    });
  });
}
// end button status
// form search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}
// end form search
// pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination) {
  let url = new URL(window.location.href);
  buttonPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      if ((page >= 1) & (page <= 5)) {
        url.searchParams.set("page", page);
        window.location.href = url.href;
      }
    });
  });
}
// end pagination
// checkBox-multi
const checkBoxMulti = document.querySelector("[checkbox-multi]");
if (checkBoxMulti) {
  const inputCheckAll = checkBoxMulti.querySelector("input[name='checkall']");
  const inputsId = checkBoxMulti.querySelectorAll("input[name='id']");
  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked == true) {
      inputsId.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputsId.forEach((input) => {
        input.checked = false;
      });
    }
  });
  inputsId.forEach((input, index) => {
    input.addEventListener("click", () => {
      const countChecked = checkBoxMulti.querySelectorAll(
        "input[name='id']:checked"
      );
      if (countChecked.length == inputsId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}
// end checkBox-multi
// form changeMulti
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const checkBoxMulti = document.querySelector("[checkbox-multi]");
    const inputsChecked = checkBoxMulti.querySelectorAll(
      "input[name='id']:checked"
    );
    const typeChange = e.target.elements.type.value;
    if (typeChange == "deleteAll") {
      const isConfirm = confirm("bạn có chắc chắn muốn xoá những sản phẩm này");
      if (!isConfirm) {
        return;
      }
    }
    if (inputsChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");
      inputsChecked.forEach((input) => {
        const id = input.value;
        if (typeChange == "change-position") {
          const position = input
            .closest("tr")
            .querySelector("input[name='position']").value;
          console.log(`${id}-${position}`);
          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });
      inputIds.value = ids.join(",");
      formChangeMulti.submit();
    } else {
      alert("vui lòng chọn ít nhất 1 bản ghi");
    }
  });
}
// end form changeMulti
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
// upload image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector(
    "[upload-image-preview]"
  );
  const uploadImageButton = uploadImage.querySelector("[upload-image-button]");
  if (uploadImagePreview) {
    uploadImageButton.style.display = "block";
  }
  uploadImageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
      uploadImageButton.style.display = "block";
    }
  });
  uploadImageButton.addEventListener("click", () => {
    uploadImageInput.value = "";
    uploadImagePreview.src = "";
    uploadImageButton.style.display = "none";
  });
}
// end upload image
