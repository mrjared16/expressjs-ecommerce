const cartService = require('../models/cartService');
const userService = require('../models/userService');
const orderService = require('../models/orderService');
const stripe = require("stripe")("sk_test_4oT1hzvutpkdsnN0jmYeVfX800MzAjh0aL");

exports.postAddItemInCart = async (req, res) => {
    if (req.session.cart == null) {
        req.session.cart = [];
    }
    const productId = req.params.id;
    req.session.cart = cartService.addItemToCart(req.session.cart, productId);
    const items = await cartService.updateCart(req, res);
    res.send(items);
}

exports.postSubItemInCart = async (req, res) => {
  const productId = req.params.id;
  req.session.cart = cartService.subItemToCart(req.session.cart, productId);
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
    const { items, totalPrice } = await cartService.getItemsDetailInCart(req.session.cart);
    const { name, phone, address } = req.user;

    const viewModel = {
        name: name ? name : '',
        phone: phone ? phone : '',
        address: address ? address : '',
        items,
        totalPrice
    };

    res.render('checkout/payment', viewModel);
}

exports.postPayment = async (req, res) => {
  const {items, totalPrice} = await cartService.getItemsDetailInCart(req.session.cart);
  const { name, phone, address } = req.user;
  const viewModel = {
    name: name ? name : '',
    phone: phone ? phone : '',
    address: address ? address : '',
    items,
    totalPrice
  };

  if (items.length == 0) {
      viewModel.alert = { type: 'danger', message: "Giỏ hàng của bạn hiện đang rỗng" };
      res.render('checkout/payment', viewModel);
      return;
  }

  if (req.body.name == '') {
      viewModel.alert = { type: 'danger', message: "Họ tên không được để trống" };
      res.render('checkout/payment', viewModel);
      return;
  }

  if (req.body.address == '') {
      viewModel.alert = { type: 'danger', message: "Địa chỉ không được để trống" };
      res.render('checkout/payment', viewModel);
      return;
  }

  if (req.body.phone == '') {
      viewModel.alert = { type: 'danger', message: "Số điện thoại không được để trống" };
      res.render('checkout/payment', viewModel);
      return;
  }

    // Check quantity of prodcut is valid
    const result = await cartService.checkCart(req.session.cart);
    if (result.isValid == false) {
        let notification = "";
        await Promise.all(result.message.map((mess) => {
            notification = notification + mess + "<br>";
        }));

        const { items, totalPrice } = await cartService.getItemsDetailInCart(req.session.cart);
        const { name, phone, address } = req.user;

        const viewModel = {
            name: name ? name : '',
            phone: phone ? phone : '',
            address: address ? address : '',
            items,
            totalPrice,
            alert: { type: 'danger', message: notification }
        };
        res.render('checkout/payment', viewModel);
        return;
    }

    const token = req.body.stripeToken;
    const charge = stripe.charges.create({
        amount: totalPrice,
        currency: "vnd",
        source: token
    }, function (err, charge) {
        if (err && err.type === "StripeCardError") {
            console.log("Your card was decliend");
        }
    });
    await orderService.placeOrder(req);
    res.render('checkout/confirmation', { cart: req.session.cart });
}

exports.checkoutCart = async (req, res) => {
    const { items, totalPrice } = await cartService.getItemsDetailInCart(req.session.cart);
    res.render('checkout/cart', { items, totalPrice });
}
