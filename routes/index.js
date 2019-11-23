var express = require('express');
var router = express.Router();
const homeController = require('../controller/homeController');

/* GET home page. */
router.get('/', homeController.index);

module.exports = router;
