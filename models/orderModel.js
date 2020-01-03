const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
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
    }],

    status: {
        type: String,
        enum: ['Đang xác nhận', 'Đang giao', 'Đã giao', 'Đã hủy'],
        default: 'Đang xác nhận'
    },
    totalPrice: Number
}, {
    timestamps: true
});


module.exports.Order = mongoose.model('order', OrderSchema, 'order');