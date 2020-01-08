var express = require('express');
var router = express.Router();
const cartController = require('../controller/cartController');
const { ensureLoggedIn } = require('../middlewares/auth');

/* GET home page. */
router.get('/cart', cartController.checkoutCart);
router.use(ensureLoggedIn({ isReturnTo: true, message: 'Bạn cần đăng nhập để có thể đặt hàng!' }));
router.get('/payment', cartController.getPayment);
router.post('/payment', cartController.postPayment);

module.exports = router;
