const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');

router.post('/:id', cartController.postAddItemInCart);
router.post('/:id/subItem', cartController.postSubItemInCart);
router.delete('/:id', cartController.postDeleteItemInCart);

module.exports = router;
