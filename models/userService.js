const User = require('./user');
const bcrypt = require('bcryptjs');
const mailerService = require('../models/mailerService');

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


exports.forgetPassword = async (thongtin) => {
    console.log(thongtin);
    if (await User.exists({email: thongtin.email})) {
        const mail = {
            to: thongtin.email,
            subject: 'Please reset your password',
            html: 'We heard that you lost your Aviato password. Sorry about that!<br><br>'
            + 'But don’t worry! You can use the following link to reset your password:<br><br>'
            + '<a href="http://localhost:4000/user/reset-password">Click here</a>'
        }
        mailerService.transporter.sendMail(mail, function(error, info){
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        });
        return true;
    }
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

module.exports.resetPassword = async (body, userEmail) => {
    const userReset = await User.findOne({email: userEmail});
    if (body.pass == body.confirmPass) {
        userReset.password = body.pass;
        await bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(userReset.password, salt, function (err, hash) {
                userReset.password = hash;
                userReset.save();
            });
        });
        return true;
    }
    return false;
}

module.exports.getUserInfo = async (usernameOfUser) => {
    const userInfo = await User.findOne({username: usernameOfUser});
    if (userInfo != null) {
      return {
        fullname: userInfo.name,
        // address: userInfo.address,
        phone: userInfo.phone
      };
    } else {
      return false;
    }
}

module.exports.postUserInfo = async (usernameOfUser, infoOfUser) => {
    const userUpdateInfo = await User.findOne({username: usernameOfUser})
    userUpdateInfo.name = infoOfUser.fullname
    // userUpdateInfo.address = infoOfUser.address
    userUpdateInfo.phone = infoOfUser.phone
    userUpdateInfo.save();
    return true;
}
