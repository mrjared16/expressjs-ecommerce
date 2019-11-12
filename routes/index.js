var express = require('express');
var router = express.Router();

const data = require('./data');
const product = require('../models/product');

/* GET home page. */
router.get('/', function (req, res, next) {
  product.find().then(result => {

    const query = result.map(item => ({
      hasBage: (item.sale | item.sale > 0) ? true : false,
      imgpath: item.img_path[0],
      name: item.name,
      price: item.price,
    }));
    console.log(query);

    res.render('index', { products: query });
  });
});

module.exports = router;
