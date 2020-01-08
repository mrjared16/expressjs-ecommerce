var express = require('express');
var router = express.Router();
const { singleUpload } = require('../models/cloudService');

const userController = require('../controller/userController');
const { ensureLoggedIn, ensureNotLoggedIn } = require('../middlewares/auth');

router.get('/:id/active', ensureNotLoggedIn, userController.getActiveAccount);

router.get('/:id/resetPassword', ensureNotLoggedIn, userController.getResetPass);
router.post('/:id/resetPassword', ensureNotLoggedIn, userController.postResetPass);

router.get('/login', ensureNotLoggedIn, userController.getLogin);
router.post('/login', ensureNotLoggedIn, userController.postLogin);

router.get('/register', ensureNotLoggedIn, userController.getRegister);
router.post('/register', ensureNotLoggedIn, userController.postRegister);

router.get('/forgetPassword', ensureNotLoggedIn, userController.getForgetPass);
router.post('/forgetPassword', ensureNotLoggedIn, userController.postForgetPass);

router.use(ensureLoggedIn({ isReturnTo: true, message: 'Bạn cần đăng nhập để truy cập trang này!' }));
router.get('/', userController.history);
router.get('/history', userController.history);

router.get('/profile', userController.getProfile);
router.post('/profile', singleUpload.single('avatar'), userController.postProfile);

router.get('/changePass', userController.getChangePass);
router.post('/changePass', userController.postChangePass);

router.get('/logout', userController.logout);

router.get('/address', userController.address);

module.exports = router;
