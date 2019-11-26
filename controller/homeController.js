const productService = require('../models/productService');

exports.index = async (req, res) => {
    const query = await productService.queryIndexHome(req, res);
    res.render('index', { products: query });
}