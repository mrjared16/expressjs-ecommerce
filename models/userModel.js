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
    status : {
        type : String,
        enum: ['active', 'inactive', 'banned', 'deleted'],
        default : 'inactive'
    }
}, {
    timestamps: true
});


module.exports.User = mongoose.model('user', UserSchema, 'user');
