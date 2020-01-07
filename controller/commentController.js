const commentService = require('../models/commentService');
const userService = require('../models/userService');
//add new review to product
exports.addNewReview = async (req, res) => {
    // console.log(req.body);
    await commentService.addNewReview(new function () {
        this.product = req.body.productId;
        this.body = req.body.reviewBody;
        if (!userService.isAuthenticated(req, res)) {
            this.name = req.body.name;
        }
        else {
            this.author = req.user._id;
        }
    });
    // comment successful
    res.send('success');
}
