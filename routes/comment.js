const router = require('express').Router();
const commentController = require('../controller/commentController');

router.post('/', commentController.addNewReview);

module.exports = router;