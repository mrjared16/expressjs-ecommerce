const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },
    
        unit_price: Number,
        quantity: Number,
    }]
});

module.exports.Cart = mongoose.model('cart', CartSchema, 'cart');