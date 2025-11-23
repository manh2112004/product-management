//href=`/admin/bin/deletePermanentProduct/${product._id}`,
const buttonRestore = document.querySelectorAll("[btn-restore]");
if (buttonRestore) {
  buttonRestore.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      const link = `/admin/bin/restoreProduct/${id}`;
      const option = {
        method: "PATCH",
      };
      fetch(link, option)
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 200) {
            alert(data.message);
            window.location.reload();
          } else {
            alert(data.message);
          }
        });
    });
  });
}
const buttonDeletePermanentProduct = document.querySelectorAll(
  "[btn-DeletePermanentProduct]"
);
if (buttonDeletePermanentProduct) {
  buttonDeletePermanentProduct.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      const link = `/admin/bin/deletePermanentProduct/${id}`;
      const option = {
        method: "DELETE",
      };
      fetch(link, option)
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 200) {
            alert(data.message);
            window.location.reload();
          } else {
            alert(data.message);
          }
        });
    });
  });
}
