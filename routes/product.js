var express = require('express');
var router = express.Router();
var productController = require('../controller/productController');

router.get('/list', productController.index);
router.get('/:id', productController.detail)

module.exports = router;
