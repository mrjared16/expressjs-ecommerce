const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    productId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'product',
        unique: true
    },
    relatedProduct: [{
        productId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'product'
        },
        boughtTogetherCount: {
            type: Number,
            default: 1
        }
    }]
});

exports.Recommendation = mongoose.model('recommendation', recommendationSchema, 'recommendation');