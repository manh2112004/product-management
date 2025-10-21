const Cart = require("../../models/cart.model");
module.exports.cartID = async (req, res, next) => {
  try {
    if (!req.cookies.cartID) {
      const cart = new Cart({ products: [] });
      await cart.save();
      const expiresCookie = 365 * 24 * 60 * 60 * 1000;
      res.cookie("cartID", cart.id, {
        expires: new Date(Date.now() + expiresCookie),
      });
      res.locals.miniCart = cart;
    } else {
      let cart = await Cart.findOne({ _id: req.cookies.cartID });
      if (!cart) {
        cart = new Cart({ products: [] });
        await cart.save();
        const expiresCookie = 365 * 24 * 60 * 60 * 1000;
        res.cookie("cartID", cart.id, {
          expires: new Date(Date.now() + expiresCookie),
        });
      }
      const products = Array.isArray(cart.products) ? cart.products : [];
      cart.totalQuantity = products.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      res.locals.miniCart = cart;
    }
  } catch (err) {
    console.error("Cart middleware error:", err);
    res.locals.miniCart = { products: [], totalQuantity: 0 };
  }
  next();
};
