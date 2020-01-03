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

  if (!userService.isAuthenticated(req, res)) {
    const viewModel = {
      alert: {
        type: 'danger',
        message: 'Bạn cần đăng nhập để có để đặt hàng!'
      }
    }
    // TODO: /user/login not checkout/cart
    res.render('user/login', viewModel);
    return;
  }

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