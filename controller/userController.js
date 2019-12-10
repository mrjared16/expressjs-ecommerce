const userService = require('../models/userService');
const passport = require('passport');

exports.getLogin = (req, res) => {
    res.render('user/login');
}

exports.postLogin = (req, res) => {
    //passport.authenticate('local');
    res.redirect('/');
}


exports.getRegister = (req, res) => {
    res.render('user/register');
}

exports.postRegister = async (req, res) => {
    const validate = await userService.registerValidate(req.body);
    if (validate.result) {
        await userService.createUser(req.body);
        res.render('user/register', { alert: { type: 'success', message: 'Đăng ký thành công!' } });
    }
    else {
        console.log(validate.message);
        res.render('user/register', { alert: { type: 'danger', message: `Đăng ký thất bại! ${validate.message}` } });
    }
}


exports.getForgetPass = (req, res) => {
    res.render('user/forget-password');
}

//TODO
exports.postForgetPass = (req, res) => {
    userService.forgetPassword(req.body);
    res.render('user/register', { alert: { type: 'success', message: 'Đã gửi đến email của bạn' } });;
}

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
}

exports.history = (req, res) => {
    res.render('dashboard/history');
};

exports.address = (req, res) => {
    res.render('dashboard/address');
};

exports.profile = (req, res) => {
    res.render('dashboard/profile');
};