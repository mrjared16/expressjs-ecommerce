const cartService = require('../models/cartService');
const userService = require('../models/userService');


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
  let viewModel = {};

  if (userService.isAuthenticated(req, res)) {
    const userInfo = await cartService.getUserInfoToPayment(req.user._id);
    viewModel = { fullname: userInfo.fullname, phone: userInfo.phone };
  }

  res.render('checkout/payment', viewModel);
}

exports.postPayment = async (req, res) => {

}