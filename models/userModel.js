const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    phone: String,
    email: String,
    name: String,
    dob: Date,
    avatar: String,
}, {
    timestamps: true
});


module.exports.User = mongoose.model('user', UserSchema, 'user');
