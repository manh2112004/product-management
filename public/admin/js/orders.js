// change status orders
async function loadOrders(status) {
  const tableBody = document.querySelector(".order-card table tbody");
  if (!tableBody) return;
  const url = `/admin/orders/${status}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const orders = data.orders;
    // Nếu không có đơn hàng
    if (!orders || orders.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center">Không có đơn hàng nào.</td>
        </tr>
      `;
      return;
    }
    // Render danh sách đơn hàng
    let html = "";
    orders.forEach((order, index) => {
      // Tính tổng tiền
      let total = 0;
      if (order.products && order.products.length > 0) {
        total = order.products.reduce(
          (sum, p) =>
            sum +
            p.price * p.quantity * (1 - (p.discountPercentage || 0) / 100),
          0
        );
      }
      // Xác định badge trạng thái
      let statusBadge = "";
      if (order.status === "confirm") {
        statusBadge = `<span class="badge bg-success">Đã Xác Nhận</span>`;
      } else {
        statusBadge = `<span class="badge bg-warning text-dark">Chưa Xác Nhận</span>`;
      }

      // Nút hành động
      let actions = `
        <a href="/admin/orders/detail/${order._id}" class="btn btn-sm btn-info">
          <i class="fa-solid fa-eye me-1"></i> Xem
        </a>
      `;

      if (order.status === "unconfirmed") {
        actions += `
          <a href="/admin/orders/confirm/${order._id}" class="btn btn-sm btn-success ms-2">
            <i class="fa-solid fa-check me-1"></i> Xác nhận
          </a>
          <a href="/admin/orders/cancel/${order._id}" class="btn btn-sm btn-danger ms-2">
            <i class="fa-solid fa-xmark me-1"></i> Hủy
          </a>
        `;
      } else if (order.status === "Đã Xác Nhận") {
        actions += `
          <a href="/admin/orders/cancel/${order._id}" class="btn btn-sm btn-danger ms-2">
            <i class="fa-solid fa-xmark me-1"></i> Hủy
          </a>
        `;
      }
      // Dòng bảng
      html += `
        <tr>
          <td class="text-center">${index + 1}</td>
          <td>${order.userInfo.fullName}</td>
          <td>${order.userInfo.phone}</td>
          <td>${order.userInfo.address}</td>
          <td>${order.user_id}</td>
          <td class="text-end">${(total * 26000).toLocaleString("vi-VN")} ₫</td>
          <td class="text-center">${new Date(order.createdAt).toLocaleString(
            "vi-VN"
          )}</td>
          <td class="text-center">${statusBadge}</td>
          <td class="text-center">${actions}</td>
        </tr>
      `;
    });
    tableBody.innerHTML = html;
  } catch (error) {
    console.error("Lỗi tải đơn hàng:", error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" class="text-center text-danger">
          Lỗi tải dữ liệu. Vui lòng thử lại.
        </td>
      </tr>
    `;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(
    "[button-unconfirmed], [button-confirm]"
  );
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const status = btn.getAttribute("status");
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      loadOrders(status);
    });
  });
});
// end change status orders
// button confirm order
const buttonConfirmOrders = document.querySelectorAll("[button-confirm-order]");
if (buttonConfirmOrders) {
  buttonConfirmOrders.forEach((button) => {
    button.addEventListener("click", () => {
      const orderId = button.getAttribute("data-id");
      const url = `/admin/orders/confirm/${orderId}`;
      const option = {
        method: "PATCH",
      };
      fetch(url, option)
        .then((res) => res.json())
        .then((data) => {
          if (data.code === 200) {
            const row = button.closest("tr");
            const statusCell = row.querySelector("td:nth-child(8)");
            if (statusCell) {
              statusCell.innerHTML = `
              <span class="badge bg-success">Xác Nhận</span>
            `;
            }
            const actionCell = row.querySelector("td:nth-child(9)");
            if (actionCell) {
              actionCell.innerHTML = `
              <a href="/admin/orders/detail/${orderId}" class="btn btn-sm btn-info">
                <i class="fa-solid fa-eye me-1"></i> Xem
              </a>
              <a href="/admin/orders/cancel/${orderId}" class="btn btn-sm btn-danger ms-2" button-cancel-order data-id="${orderId}">
                <i class="fa-solid fa-xmark me-1"></i> Hủy
              </a>
            `;
            }
            alert("Đã xác nhận đơn hàng!");
          }
        });
    });
  });
}
//end button confirm order
// button cancel order
const buttonCancelOrder = document.querySelectorAll("[button-cancel-order]");
if (buttonCancelOrder) {
  buttonCancelOrder.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      const link = `/admin/orders/cancel/${id}`;
      const option = {
        method: "PATCH",
      };
      fetch(link, option)
        .then((res) => res.json())
        .then((data) => {
          window.location.reload();
        });
    });
  });
}
// end button cancel order
