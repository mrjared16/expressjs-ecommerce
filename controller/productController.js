const productService = require('../models/productService') 


exports.index = async (req, res) => {
    const {products, pageOptions} = await productService.queryIndex(req, res);
    res.render('product/list', { products: products, pageOptions: pageOptions} );
}

exports.detail = async (req, res) => {
    const queryDetail = await productService.queryDetail(req, res);
    res.render('product/detail', {
        relate: null,
        detail: queryDetail
    });
}
