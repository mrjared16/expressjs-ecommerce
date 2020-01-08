const router = require('express').Router();
const commentController = require('../controller/commentController');

router.post('/', commentController.addNewReview);
router.get('/api/:id', commentController.getReviews);

module.exports = router;