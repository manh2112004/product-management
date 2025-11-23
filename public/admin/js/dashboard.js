const statistic = window.statisticData;
const pieCtx = document.getElementById("pieChart").getContext("2d");
new Chart(pieCtx, {
  type: "pie",
  data: {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: [statistic.product.active, statistic.product.inactive],
      },
    ],
  },
});
const orderCtx = document.getElementById("orderChart").getContext("2d");
new Chart(orderCtx, {
  type: "pie",
  data: {
    labels: ["Đã xác nhận", "Chưa xác nhận"],
    datasets: [
      {
        data: [statistic.order.confirm, statistic.order.unconfirmed],
      },
    ],
  },
});
const barCtx = document.getElementById("barChart").getContext("2d");
new Chart(barCtx, {
  type: "bar",
  data: {
    labels: ["Danh mục", "Sản phẩm", "Admin", "User", "Đơn hàng"],
    datasets: [
      {
        label: "Số lượng",
        data: [
          statistic.categoryProduct.total,
          statistic.product.total,
          statistic.account.total,
          statistic.user.total,
          statistic.order.total,
        ],
      },
    ],
  },
  options: {
    responsive: true,
    scales: { y: { beginAtZero: true } },
  },
});
