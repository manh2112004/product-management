const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const productHelper = require("../../helpers/product");
// [GET] /checkout
module.exports.index = async (req, res) => {
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
  res.render("client/pages/checkout/index.pug", {
    pageTitle: "Trang đặt hàng",
    cartDetail: cart,
  });
};
// [POST] /checkout/order
module.exports.order = async (req, res) => {
  const cartID = req.cookies.cartID;
  const userInfo = req.body;
  const cart = await Cart.findOne({
    _id: cartID,
  });
  const products = [];
  let orderTotal = 0;
  for (const product of cart.products) {
    const objectProduct = {
      product_id: product.product_id,
      price: 0,
      quantity: product.quantity,
      discountPercentage: product.quantity,
    };
    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("price discountPercentage");
    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;
    products.push(objectProduct);
  }
  const oderInfo = {
    cart_id: cartID,
    userInfo: userInfo,
    products: products,
  };
  const order = new Order(oderInfo);
  order.save();
  await Cart.updateOne(
    {
      _id: cartID,
    },
    {
      products: [],
    }
  );
  res.redirect(`/checkout/success/${order.id}`);
};
// [GET] /checkout/success/:orderID
module.exports.success = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderID,
  });
  for (const product of order.products) {
    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("title thumbnail");
    product.productInfo = productInfo;
    product.priceNew = productHelper.priceNewProduct(product);
    product.totalPrice = product.priceNew * product.quantity;
  }
  order.totalPrice = order.products.reduce((sum, item) => {
    return sum + item.totalPrice;
  }, 0);
  res.render("client/pages/checkout/success.pug", {
    pageTitle: "Đặt hàng thành công",
    order: order,
  });
};
