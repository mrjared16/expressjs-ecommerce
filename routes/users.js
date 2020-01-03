var express = require('express');
var router = express.Router();
const passport = require('passport');
const userController = require('../controller/userController');

/* GET users listing. */
router.get('/login', userController.getLogin);

router.post('/login', userController.postLogin);



router.get('/register', userController.getRegister);

router.post('/register', userController.postRegister);



router.get('/forgetPassword', userController.getForgetPass);

router.post('/forgetPassword', userController.postForgetPass);



router.get('/logout', userController.logout);

router.get('/:id/resetPassword', userController.getResetPass);
router.post('/:id/resetPassword', userController.postResetPass);

router.get('/:id/active', userController.getActiveAccout);
module.exports = router;
