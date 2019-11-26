var express = require('express');
var router = express.Router();
const data = require('./data');
const product = require('../models/product');

/* GET home page. */
router.get('/list', async (req, res, next) => {
    console.log(req.query);
    // category,  gender, group, color, size
    //order
    const result = await product.find({
            brand: { "$regex": new RegExp(req.query.brand, 'i') },
            category: { "$regex": new RegExp(req.query.category, 'i') },
            gender: { "$regex": new RegExp(req.query.gender, 'i') },
            group: { "$regex": new RegExp(req.query.group, 'i') },
        });
    console.log(result);
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
