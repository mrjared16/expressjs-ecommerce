const { User } = require('./userModel');
const bcrypt = require('bcryptjs');
const mailerService = require('../models/mailerService');
const { Product } = require('./productModel');

// services
exports.getUserByUsername = async (username) => {
    var query = { username: username };
    return await User.findOne(query);
}

//register
exports.createUser = async (thongtin) => {
    const newUser = new User({
        username: thongtin.username,
        password: thongtin.password,
        email: thongtin.email,
        name: thongtin.name,
    });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newUser.password, salt);
    newUser.password = hashPassword;
    await newUser.save();
    return newUser;
}

exports.registerValidate = async (thongtin) => {
    let result = true;
    let message = '';
    if (thongtin.password.length < 6) {
        result = false;
        message = 'Mật khẩu phải dài từ 6 kí tự';
    }
    else if (await this.getUserByUsername(thongtin.username)) {
        result = false;
        message = 'Tên đăng nhập đã được sử dụng';
    }
    return ({
        result,
        message
    })
}

// login
exports.comparePassword = async (candidatePassword, hash) => {
    const result = await bcrypt.compare(candidatePassword, hash);
    return result;
}

// forget password
exports.forgetPassword = async (userEmail) => {
    const userForgetPass = await User.findOne({ email: userEmail });
    if (userForgetPass) {
        const mail = {
            from: process.env.USERNAME_YANDEX,
            to: userEmail,
            subject: 'Reset mật khẩu Aviato',
            html: 'Chúng tôi vừa tiếp nhận thông tin quên mật khẩu của bạn.!<br><br>'
                + 'Đừng lo lắng! Bạn có thể nhấn vào liên kết dưới đây để reset mật khẩu của bạn:<br><br>'
                + `<u>http://localhost:4000/user/${userForgetPass.id}/resetPassword></u>`
        }
        mailerService.transporter.sendMail(mail, function (error, info) {
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

exports.resetPassword = async (body, userId) => {
    const userReset = await User.findOne({ _id: userId });
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

exports.updateUserInfo = async ({ username }, newInfo, imageFile) => {
    const user = await exports.getUserByUsername(username);
    user.name = newInfo.name;
    user.address = newInfo.address;
    user.phone = newInfo.phone;
    user.dob = newInfo.dob;
    if (imageFile) {
        user.avatar = `/static/images/${imageFile}`;
    }
    else {
        user.avatar = newInfo.avatar;
    }
    return await user.save();
}

exports.changePassword = async (userId, oldPass, newPass, confirmPass) => {
    const userChangePass = await User.findOne({ _id: userId });
    var isSuccess = false;
    const comparePass = await new Promise((resolve, reject) => {
        bcrypt.compare(oldPass, userChangePass.password, async function (err, isMatch) {
            if (isMatch && newPass == confirmPass) {
                isSuccess = true;
                await bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newPass, salt, function (err, hash) {
                        userChangePass.password = hash;
                        userChangePass.save();
                    });
                });
            }
            resolve(isSuccess);
        });
    });
    if (isSuccess) {
        return true;
    } else {
        return false;
    }
};

exports.sendMailActiveAccount = async (userId, userEmail) => {
    const mail = {
        from: process.env.USERNAME_YANDEX,
        to: userEmail,
        subject: 'Kích hoạt tài khoản',
        html: 'Chaò mừng bạn đến với Aviato shop!<br><br>'
            + 'Xin vui lòng bấm vào đường link bên dưới để kích hoạt tài khoản của bạn:<br><br>'
            + `<u>http://localhost:4000/user/${userId}/active</u>`
    }
    mailerService.transporter.sendMail(mail, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.activeAccout = async (userId) => {
    const newUser = await User.findOne({ _id: userId });
    newUser.active = true;
    await newUser.save();
}

exports.getInfoProduct = async (productId) => {
    const product = await Product.findOne({_id: productId});
    return {
      name: product.name,
      img: product.assert.img
    }
}
