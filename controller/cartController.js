const cartService = require('../models/cartService');
const express = require('express');
const app = express();

exports.postAddItemInCart = async (req, res) => {
  if (req.session.cart == null) {
    req.session.cart = [];
  }
  await cartService.addItemInCart(req.session.cart, req.params.id);
  let items = await cartService.getItemsInCart(req.session.cart);
  if (req.session.username != null) {
    await cartService.setItemsInOrderUser(req.session.cart, req.session.username);
  }
  req.app.locals.itemsInMyCart = items;
  req.app.locals.totalPrice = await cartService.totalPriceInCart(req.session.cart);
  res.send(items);
}

exports.postDeleteItemInCart = async (req, res) => {
  console.log(req.session.cart);
  req.session.cart = await cartService.deleteItemInCart(req.session.cart, req.params.id);
  console.log(req.session.cart);
  let items = await cartService.getItemsInCart(req.session.cart);
  if (req.session.username != null) {
    await cartService.setItemsInOrderUser(req.session.cart, req.session.username);
  }
  req.app.locals.itemsInMyCart = items;
  console.log(req.app.locals.itemsInMyCart);
  req.app.locals.totalPrice = await cartService.totalPriceInCart(req.session.cart);
  console.log(req.session.cart);
  res.send(items);
}

exports.getPayment = async (req, res) => {
  if (!isAuthenticated(req, res)) {
    res.render('checkout/payment');
  } else {
    const userInfo = await cartService.getUserInfoToPayment(req.user.id);
    res.render('checkout/payment', {fullname: userInfo.fullname, phone: userInfo.phone});
  }
}

const isAuthenticated = (req, res) => {
    return (req.user) ? true : false;
}
