const cartService = require('../models/cartService');
const express = require('express');
const app = express();

exports.postAddItemInCart = async (req, res) => {
  if (req.session.cart == null) {
    req.session.cart = [];
  }
  await cartService.addItemInCart(req.session.cart, req.params.id);
  let items = await cartService.itemsInCart(req.session.cart);
  req.app.locals.itemsInMyCart = items;
  req.app.locals.totalPrice = await cartService.totalPriceInCart(req.session.cart);
  res.send(items);
}

exports.postDeleteItemInCart = async (req, res) => {
  await cartService.deleteItemInCart(req.session.cart, req.params.id);
  let items = await cartService.itemsInCart(req.session.cart);
  req.app.locals.itemsInMyCart = items;
  req.app.locals.totalPrice = await cartService.totalPriceInCart(req.session.cart);
  res.send(items);
}
