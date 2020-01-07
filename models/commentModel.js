const mongoose = require('mongoose');

const ProductCommentSchema = new mongoose.Schema({
    body: String,
    name: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    title: String,
    rating: Number,
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

exports.ProductComment = mongoose.model('product-comment', ProductCommentSchema, 'product-comment');