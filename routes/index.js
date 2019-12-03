var express = require('express');
var router = express.Router();
const homeController = require('../controller/homeController');

/* GET home page. */
router.get('/', homeController.index);
router.get('/contact', homeController.contact);
router.get('/faq', homeController.faq);
router.get('/about', homeController.about);
router.get('/policy', homeController.policy);
router.get('/terms', homeController.terms);
module.exports = router;
