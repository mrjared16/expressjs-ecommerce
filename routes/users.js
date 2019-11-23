var express = require('express');
var router = express.Router();
const userController = require('../controller/userController');

/* GET users listing. */
router.get('/login', userController.getLogin);

router.post('/login', userController.postLogin);



router.get('/register', userController.getRegister);

router.post('/register', userController.postRegister);



router.get('/forget-password', userController.getForgetPass);

router.post('/forget-password', userController.postForgetPass);



router.get('/logout', userController.logout);

module.exports = router;
