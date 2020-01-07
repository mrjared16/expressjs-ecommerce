const commentService = require('../models/commentService');

//add new review to product
exports.addNewReview = async (req, res) => {
    // (!req.reviewBody || 0 === reviewBody.length);
    if (!req.isAuthenticated() || (!req.body.name || req.body.name.length === 0)) {
        req.flash('alert', 'danger');
        req.flash('alert', 'Bạn phải nhập tên để đánh giá');
        res.redirect('/product/' + req.body.productId + "#reviews");
        return;
    }

    await commentService.addNewReview(new function () {
        this.product = req.body.productId;
        this.body = req.body.reviewBody;
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            this.name = req.body.name;
        }
        else {
            this.author = req.user._id;
        }
    });
    // comment successful
    res.redirect('/product/' + req.body.productId + "#reviews");
}
