const cartService = require('../models/cartService')

exports.postAddItemInCart = async (req, res) => {
  if (req.session.cart == null) {
    req.session.cart = [];
  }
  await cartService.addItemInCart(req.session.cart, req.params.id);
  let items = await cartService.itemsInCart(req.session.cart);
  res.send(items);
}
