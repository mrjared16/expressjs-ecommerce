const cartService = require('../models/cartService')

exports.postAddItemInCart = async (req, res) => {
  if (req.session.cart == null) {
    req.session.cart = [];
  }
  await cartService.addItemInCart(req.session.cart, req.params.id);
  let items = await cartService.itemsInCart(req.session.cart);
  res.send(items);
}

exports.deleteItemInCart = async (req, res) => {
  console.log(req.session.cart.length);
  await Promise.all(req.session.cart.map((item, index) => {
    if (item.id == req.params.id) {
      req.session.cart.splice(index, 1);
    }
  }))
  let items = await cartService.itemsInCart(req.session.cart);
  res.send(items);
}
