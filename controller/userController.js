const userService = require('../models/userService');

exports.getLogin = (req, res) => {
    res.render('user/login');
}

exports.postLogin = (req, res) => {
    if (userService.loginValidate(req.body)) {
        res.render('/');
    }
    else {
        res.render('user/login', { alert: { type: 'danger', message: 'Ten dang nhap hoac mat khau khong chinh xac!' } });
    }
}


exports.getRegister = (req, res) => {
    res.render('user/register');
}

exports.postRegister = (req, res) => {

    if (userService.registerValidate(req.body)) {
        res.render('user/register', { alert: { type: 'success', message: 'Dang ky thanh cong!' } });
    }
    else {
        res.render('user/register', { alert: { type: 'danger', message: 'Dang ky that bai!' } });
    }
}


exports.getForgetPass = (req, res) => {
    res.render('user/forget-password');
}

//TODO
exports.postForgetPass = (req, res) => {
    userService.forgetPassword(req.body);
    res.render('user/register', { alert: { type: 'success', message: 'Da gui mail den email cua ban1' } });;
}

exports.logout = (req, res) => {
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