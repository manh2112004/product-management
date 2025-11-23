const Cart = require("../../models/cart.model");
module.exports.cartID = async (req, res, next) => {
  try {
    if (res.locals.user) {
      const userId = res.locals.user._id;
      let cart = await Cart.findOne({ user_id: userId });
      console.log(cart);
      if (!cart) {
        cart = new Cart({
          user_id: userId,
          products: [],
        });
        await cart.save();
      }
      // Tính tổng số lượng
      const products = Array.isArray(cart.products) ? cart.products : [];
      cart.totalQuantity = products.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      res.locals.miniCart = cart;
      res.cookie("cartID", cart.id, {
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      });
    } else {
      res.locals.miniCart = { products: [], totalQuantity: 0 };
      res.clearCookie("cartID"); // xóa cookie cũ nếu có
    }
  } catch (err) {
    console.error("Cart middleware error:", err);
    res.locals.miniCart = { products: [], totalQuantity: 0 };
  }
  next();
};
