var express = require('express');
var router = express.Router();
const data = require('./data');
const product = require('../models/product');

/* GET home page. */
router.get('/list', function (req, res, next) {
    product.aggregate().sample(6).then(result => {

        const query = result.map(item => ({
            hasBage: (item.sale | item.sale > 0) ? true : false,
            imgpath: item.img_path[0],
            name: item.name,
            price: item.price,
        }));
        console.log(query);
        res.render('product/list', { products: query });
    });
});

router.get('/detail', function (req, res, next) {
    res.render('product/detail', { relate: data('relate'), detail: data('detail') });
});

module.exports = router;
