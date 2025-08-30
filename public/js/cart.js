// cập nhật số lượng sản phẩm trong giỏ hàng
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if (inputsQuantity.length > 0) {
  inputsQuantity.forEach((input) => {
    input.addEventListener("change", (e) => {
      const product_ID = input.getAttribute("item-id");
      const quantity = input.value;
      window.location.href = `/cart/update/${product_ID}/${quantity}`;
    });
  });
}
//end cập nhật số lượng sản phẩm trong giỏ hàng
