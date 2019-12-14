const userService = require('../models/userService');

exports.getLogin = (req, res) => {
    res.render('user/login');
}

exports.postLogin = (req, res) => {
    res.redirect('/');
}


exports.getRegister = (req, res) => {
    res.render('user/register');
}

exports.postRegister = async (req, res) => {
    if (await userService.registerValidate(req.body)) {
        res.render('user/register', { alert: { type: 'success', message: 'Đăng ký thành công!' } });
    }
    else {
        res.render('user/register', { alert: { type: 'danger', message: 'Đăng ký thất bại! Tên đăng nhập đã được sử dụng' } });
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

exports.resetPass = (req, res) => {
    res.render('user/reset-password')
}