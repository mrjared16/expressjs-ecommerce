const productService = require('../models/productService');
const productViewModel = require('../models/productViewModel')
const cartService = require('../models/cartService');

exports.index = async (req, res) => {
    const products = await productService.getHotProducts(req, res);
    const viewModel = {
        products: productViewModel.getProductListViewModel(products)
    }
    res.render('index', viewModel);
}
exports.faq = (req, res) => {
    res.render('static/faq');
}

exports.contact = (req, res) => {
    res.render('static/contact');
}

exports.about = (req, res) => {
    res.render('static/about');
}

exports.policy = (req, res) => {
    res.render('static/policy');
}

exports.terms = (req, res) => {
    res.render('static/terms');
}
