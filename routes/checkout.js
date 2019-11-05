var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/cart', function(req, res, next) {
    res.render('checkout/cart');
});

router.get('/payment', function(req, res, next) {
    res.render('checkout/payment');
});

module.exports = router;
