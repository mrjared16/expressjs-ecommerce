const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');

router.post('/:id', cartController.postAddItemInCart);

module.exports = router;
