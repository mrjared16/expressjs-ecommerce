const cartService = require('../models/cartService');
const userService = require('../models/userService');
const orderService = require('../models/orderService');

exports.postAddItemInCart = async (req, res) => {
  if (req.session.cart == null) {
    req.session.cart = [];
  }
  const productId = req.params.id;
  req.session.cart = cartService.addItemToCart(req.session.cart, productId);
  const items = await cartService.updateCart(req, res);
  res.send(items);
}

exports.postDeleteItemInCart = async (req, res) => {
  const productId = req.params.id;

  req.session.cart = cartService.deleteItemInLocalCart(req.session.cart, productId);

  const items = await cartService.updateCart(req, res);
  res.send(items);
}

exports.getPayment = async (req, res) => {
  const { name, phone, address } = req.user;

  const viewModel = {
    name: name ? name : '',
    phone: phone ? phone : '',
    address: address ? address : ''
  };

  res.render('checkout/payment', viewModel);
}

exports.postPayment = async (req, res) => {
  await orderService.placeOrder(req);
  res.render('checkout/confirmation');
}

exports.checkoutCart = async (req, res) => {
    const {items, totalPrice} = await cartService.getItemsDetailInCart(req.session.cart);
    res.render('checkout/cart', {items, totalPrice});
}
