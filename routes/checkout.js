var express = require('express');
var router = express.Router();
const cartController = require('../controller/cartController')
/* GET home page. */
router.get('/cart', function(req, res, next) {
    res.render('checkout/cart');
});

router.get('/payment', cartController.getPayment);
router.post('/payment', cartController.postPayment);

module.exports = router;
