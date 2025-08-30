// permissions
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
  const button = document.querySelector("[button-submit]");
  button.addEventListener("click", (e) => {
    let Permissions = [];
    const rows = tablePermissions.querySelectorAll("[data-name]");
    rows.forEach((row) => {
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");
      if (name == "id") {
        inputs.forEach((input) => {
          const id = input.value;
          Permissions.push({
            id: id,
            permissions: [],
          });
        });
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked;
          if (checked) {
            Permissions[index].permissions.push(name);
          }
        });
      }
    });
    console.log(Permissions);
    if (Permissions.length > 0) {
      const formChangePermissions = document.querySelector(
        "#form-change-permissions"
      );
      console.log(formChangePermissions);
      const inputPermissions = formChangePermissions.querySelector(
        "input[name='permissions']"
      );
      inputPermissions.value = JSON.stringify(Permissions);
      formChangePermissions.submit();
    }
  });
}
// end permissions
// permissions-data-default
const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
  const record = JSON.parse(dataRecords.getAttribute("data-records"));
  const tablePermissions = document.querySelector("[table-permissions]");
  record.forEach((item, index) => {
    const permissions = item.permissions;
    permissions.forEach((permission) => {
      const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
      const input = row.querySelectorAll("input")[index];
      input.checked = true;
    });
  });
}
//end permissions-data-default
