const mongoose = require('mongoose');
require('./commentModel');

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number,
    description: {
        type: String,
        default: ''
    },
    assert: {
        img: [String]
    },
    view: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    //TODO: sale

    gender: { type: mongoose.Schema.Types.ObjectId, ref: 'gender' },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'brand' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'group' },
    option: {
        color: [{ type: mongoose.Schema.Types.ObjectId, ref: 'color' }],
        size: [{ type: mongoose.Schema.Types.ObjectId, ref: 'size' }]
    },
    review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product-comment'
    }],
}, {
    timestamps: true
});

exports.Product = mongoose.model('product', ProductSchema, 'product');

const GenderSchema = new mongoose.Schema({
    name: String,
    key: String
});
const BrandSchema = new mongoose.Schema({
    name: String,
    key: String
});
const CategorySchema = new mongoose.Schema({
    name: String,
    key: String
});
const GroupSchema = new mongoose.Schema({
    name: String,
    key: String
});
const ColorOptionSchema = new mongoose.Schema({
    name: String,
    key: String
});
const SizeOptionSchema = new mongoose.Schema({
    name: String,
    key: String
});

exports.Gender = mongoose.model('gender', GenderSchema, 'gender');
exports.Brand = mongoose.model('brand', BrandSchema, 'brand');
exports.Category = mongoose.model('category', CategorySchema, 'category');
exports.Group = mongoose.model('group', GroupSchema, 'group');
exports.ColorOption = mongoose.model('color', ColorOptionSchema, 'color');
exports.SizeOption = mongoose.model('size', SizeOptionSchema, 'size');