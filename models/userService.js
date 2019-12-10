const User = require('./user');
const bcrypt = require('bcryptjs');

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
        name: thongtin.name
    });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newUser.password, salt);
    newUser.password = hashPassword;
    await newUser.save();
}

exports.registerValidate = async (thongtin) => {
    let result = true;
    let message = '';
    if (thongtin.password.length < 6)
    {
        result = false;
        message = 'Mật khẩu phải dài từ 6 kí tự';
    }
    else if (await this.getUserByUsername(thongtin.username))
    {
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
    console.log(result);
    return result;
}

// forget password
exports.forgetPassword = (thongtin) => {
    console.log(thongtin);
    return false;
}