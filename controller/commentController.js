const commentService = require('../models/commentService');
const Util = require('../util');

//add new review to product
exports.addNewReview = async (req, res) => {
    // (!req.reviewBody || 0 === reviewBody.length);
    if (!req.isAuthenticated() && (!req.body.name || req.body.name.length === 0)) {
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

exports.getReviews = async (req, res, next) => {
    if (req.params.id == null) {
        res.send([]);
        return;
    }
    
    const page = (req.query.page) ? parseInt(req.query.page) : 1;
    const limit = (req.query.limit) ? parseInt(req.query.limit) : 5;
    const id = req.params.id;

    const { review } = await commentService.getReviews(id, page, limit);

    if (!review) {
        console.log('get reviews error');
        res.send(new Error('error'));
    }
    const result = review.map(_review => {
        return {
            body: _review.body,
            createdAt: Util.getDateFormat(_review.createdAt),
            author: _review.author,
            name: (_review.author) ? _review.author.name : _review.name,
            avatar: (_review.author) ? _review.author.avatar : ''
        };
    });
    res.send(result);
}