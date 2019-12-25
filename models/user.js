const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    phone: String,
    email: String,
    name: String,
    dob: Date,
    avatar: String,
    active: Boolean
});

module.exports = mongoose.model('user', UserSchema, 'user');
