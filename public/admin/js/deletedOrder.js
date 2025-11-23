const buttonRestore = document.querySelectorAll("[button-restore]");
if (buttonRestore) {
  buttonRestore.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      const link = `/admin/bin/restoreOrder/${id}`;
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
const buttonDeletePermanent = document.querySelectorAll("[button-delete]");
if (buttonDeletePermanent) {
  buttonDeletePermanent.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      const link = `/admin/bin/deletePermanentOrder/${id}`;
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
