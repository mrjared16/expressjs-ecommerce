var express = require('express');
var router = express.Router();
const passport = require('passport');
const userController = require('../controller/userController');

/* GET users listing. */
router.get('/login', userController.getLogin);

router.post('/login', passport.authenticate('local'), userController.postLogin);



router.get('/register', userController.getRegister);

router.post('/register', userController.postRegister);



router.get('/forgetPassword', userController.getForgetPass);

router.post('/forgetPassword', userController.postForgetPass);



router.get('/logout', userController.logout);

router.get('/resetPassword', userController.getResetPass);
router.post('/resetPassword', userController.postResetPass);


module.exports = router;
