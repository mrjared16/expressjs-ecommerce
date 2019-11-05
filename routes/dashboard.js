var express = require('express');
var router = express.Router();


router.get('/', (req, res) => {
    res.redirect('dashboard/history');
});

router.get('/history', (req, res) => {
    res.render('dashboard/history');
});

router.get('/address', (req, res) => {
    res.render('dashboard/address');
});

router.get('/profile', (req, res) => {
    res.render('dashboard/profile');
});
module.exports = router;
