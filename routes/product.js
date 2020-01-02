var express = require('express');
var router = express.Router();
var productController = require('../controller/productController');

router.get('/list', productController.getList);
router.get('/:id', productController.getDetail)

module.exports = router;
