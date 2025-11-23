const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");
// [POST]/cart/add/:productID
module.exports.addPost = async (req, res) => {
  if (res.locals.user && res.locals.user._id) {
    const product_Id = req.params.productID;
    const quantity = req.body.quantity;
    const cartID = req.cookies.cartID;
    const cart = await Cart.findOne({
      _id: cartID,
    });
    const existProductInCart = cart.products.find(
      (item) => item.product_id == product_Id
    );
    if (existProductInCart) {
      const quantityNew = parseInt(quantity) + existProductInCart.quantity;
      await Cart.updateOne(
        {
          _id: cartID,
          "products.product_id": product_Id,
        },
        {
          $set: {
            "products.$.quantity": quantityNew, //tìm vào mảng products trong cart và update quantity
          },
        }
      );
    } else {
      const objectCart = [
        {
          product_id: product_Id,
          quantity: quantity,
        },
      ];
      await Cart.updateOne(
        { _id: cartID },
        { $push: { products: objectCart } }
      );
    }
    req.flash("success", "Thêm thành công");
    const backURL = req.get("Referer") || "/cart";
    res.redirect(backURL);
  } else {
    req.flash("error", "Bạn chưa đăng nhập");
    return res.redirect(req.get("Referer") || "/login");
  }
};
// [GET]/cart
module.exports.index = async (req, res) => {
  try {
    const cartID = req.cookies.cartID;
    const cart = await Cart.findOne({ _id: cartID });
    if (cart.products.length > 0) {
      for (const item of cart.products) {
        const productID = item.product_id;
        const productInfo = await Product.findOne({
          _id: productID,
          deleted: false,
        }).select("title thumbnail slug price discountPercentage");
        productInfo.priceNew = productHelper.priceNewProduct(productInfo);
        item.productInfo = productInfo;
        item.totalPrice = productInfo.priceNew * item.quantity;
      }
    }
    cart.totalPrice = cart.products.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
    res.render("client/pages/cart/index.pug", {
      pageTitle: "Trang giỏ hàng",
      cartDetail: cart,
    });
  } catch (error) {
    console.error("Cart controller error:", error);
  }
};
// [GET]/cart/delete/:productID
module.exports.delete = async (req, res) => {
  const cartID = req.cookies.cartID;
  const product_ID = req.params.productID;
  await Cart.updateOne(
    {
      _id: cartID,
    },
    {
      $pull: { products: { product_id: product_ID } }, //tìm vào mảng products trong cart và xoá product_ID
    }
  );
  req.flash("success", "Đã xoá sản phẩm");
  res.redirect(req.get("Referer") || "/cart");
};
// [GET]/cart/update/:productID/:quantity
module.exports.update = async (req, res) => {
  const cartID = req.cookies.cartID;
  const product_ID = req.params.productID;
  const quantity = req.params.quantity;
  await Cart.updateOne(
    {
      _id: cartID,
      "products.product_id": product_ID,
    },
    {
      $set: {
        "products.$.quantity": quantity, //tìm vào mảng products trong cart và update quantity
      },
    }
  );
  req.flash("success", "cập nhật số lượng thành công");
  res.redirect(req.get("Referer") || "/cart");
};
