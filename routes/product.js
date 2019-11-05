var express = require('express');
var router = express.Router();
const data = require('./data').array;

/* GET home page. */
router.get('/list', function(req, res, next) {
    console.log('list');
    res.render('product/list', {products: data});
});

module.exports = router;
