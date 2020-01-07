var express = require('express');
var router = express.Router();
const homeController = require('../controller/homeController');
const usersRouter = require('./users');
const productRouter = require('./product');
const checkoutRouter = require('./checkout');
const cartRouter = require('./cart');

/* GET statics page. */
router.get('/', homeController.index);
router.get('/contact', homeController.contact);
router.get('/faq', homeController.faq);
router.get('/about', homeController.about);
router.get('/policy', homeController.policy);
router.get('/terms', homeController.terms);

// routing
router.use('/user', usersRouter);
router.use('/product', productRouter);
router.use('/checkout', checkoutRouter);
router.use('/cart', cartRouter);

module.exports = router;
