var express = require('express');
var router = express.Router();
const userController = require('../controller/userController');


router.get('/', userController.history);

router.get('/history', userController.history);

router.get('/address', userController.address);

router.get('/profile', userController.profile);
module.exports = router;
