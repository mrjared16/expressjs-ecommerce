const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    phone: String,
    address: String,
    email: String,
    name: String,
    dob: Date,
    avatar: String,
    shippingAddress: [{
        name: String,
        address: String,
        phone: String
    }],
    active: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


module.exports.User = mongoose.model('user', UserSchema, 'user');
