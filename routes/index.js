var express = require('express');
var router = express.Router();
const data = require('./data').array;

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log('index');
  res.render('index', {products: data});
});

module.exports = router;
