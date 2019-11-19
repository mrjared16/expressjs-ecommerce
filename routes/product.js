var express = require('express');
var router = express.Router();
const data = require('./data');
const product = require('../models/product');

/* GET home page. */
router.get('/list', async (req, res, next) => {
    console.log(req.query);
    const result = await product.find();
    const query = result.map(item => ({
        hasBage: (item.sale | item.sale > 0) ? true : false,
        imgpath: item.img_path[0],
        name: item.name,
        price: item.price,
        id: item._id
    }));

    console.log(query);

    res.render('product/list', { products: query });
});

router.get('/:id', async (req, res, next) => {
    const detail = await product.findById(req.params.id);
    res.render('product/detail', {
        relate: null,
        detail: {
            active_img: detail.img_path[0],
            img: detail.img_path.slice(1, detail.img_path.length),
            name: detail.name,
            description: detail.description,
            price: detail.price,
            color: null,
            quantity: detail.quantity,
            categories: detail.categories
        }
    });
});

module.exports = router;
