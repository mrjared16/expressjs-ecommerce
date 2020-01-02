const mongoose = require('mongoose');

const ProductCommentSchema = new mongoose.Schema({
    title: String,
    body: String,
    rating: Number,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    subcomment: [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        body: String,
    }]
}, {
    timestamps: true
});

module.exports.ProductComment = mongoose.model('product-comment', ProductCommentSchema, 'product-comment');