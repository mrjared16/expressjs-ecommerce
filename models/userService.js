const User = require('./user');
const bcrypt = require('bcryptjs');

exports.createUser = async (thongtin) => {
    // const salt = await bcrypt.genSalt(10);
    // const newPassword = await bcrypt.hash(thongtin.password);
    const newUser = new User({
        username: thongtin.username,
        password: thongtin.password,
        email: thongtin.email,
        name: thongtin.name
    });
    console.log(newUser);
    await bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save();
        });
    });
    // const res = await newUser.save();
    // console.log('registered!', res);
    return true;
}

exports.registerValidate = async (thongtin) => {
    console.log(thongtin);
    var query = { username: thongtin.username };
    if (await User.findOne(query))
        return false;
    console.log('wait for register!');
    const res = await this.createUser(thongtin);
    console.log('res', res);
    return true;
}


exports.forgetPassword = (thongtin) => {
    console.log(thongtin);
    return false;
}


module.exports.getUserByUsername = function (username, callback) {
    var query = { username: username };
    User.findOne(query, callback);
}


module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}