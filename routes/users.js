var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/login', function (req, res, next) {
  res.render('user/login');
});

router.post('/login', (req, res) => {
  res.redirect('/');
});



router.get('/register', function (req, res, next) {
  res.render('user/register');
});

router.post('/register', (req, res) => {
  res.redirect('/');
});



router.get('/forget-password', function (req, res, next) {
  res.render('user/forget-password');
});

router.post('/forget-password', (req, res) => {
  res.redirect('/');
});



router.get('/logout', (req, res) => {
  //res.logout();
  res.redirect('/');
});


router.get('/dashboard', (req, res) => {
  res.render('user/dashboard');
});

module.exports = router;
