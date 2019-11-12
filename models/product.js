const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String,
    brand: String,
    type: String,
    categories: [String],
    price: Number,
    quantity: Number,
    sale: Number,
    img_path: [String],
    review: [{
        username: String,
        comment: String,
        date: Date
    }],
    description: String,
    rating: Number
});

module.exports = mongoose.model('product', ProductSchema, 'product');