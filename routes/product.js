var express = require('express');
var router = express.Router();
const data = require('./data');

/* GET home page. */
router.get('/list', function(req, res, next) {
    res.render('product/list', {products: data('list')});
});

router.get('/detail', function(req, res, next) {
    res.render('product/detail', {relate: data('relate'), detail: data('detail')});
});

module.exports = router;
