const productService = require('../models/productService')


exports.getList = async (req, res) => {
    if (req.query) {
        res.locals.query = req.query;
    }
    const { products, pageOptions } = await productService.queryIndex(req, res);
    res.render('product/list', { products: products, pageOptions: pageOptions });
}

exports.getDetail = async (req, res) => {
    const queryDetail = await productService.queryDetail(req, res);
    res.render('product/detail', {
        relate: null,
        detail: queryDetail
    });
}
