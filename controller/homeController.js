const productService = require('../models/productService');
const cartService = require('../models/cartService');

exports.index = async (req, res) => {
    const query = await productService.queryIndexHome(req, res);
    res.render('index', { products: query});
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
