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
exports.postForgetPass = async (req, res) => {
    req.session.email = req.body.email;
    if (await userService.forgetPassword(req.body)) {
        res.render('user/forget-password', { alert: { type: 'success', message: 'Đã gửi đến email của bạn' } });;
    }
    else {
        console.log('hit me alert');
        res.render('user/forget-password', { alert: { type: 'danger', message: 'Email không tồn tại' } });;
    }
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

exports.getResetPass = (req, res) => {
    res.render('user/reset-password')
}

exports.postResetPass = async (req, res) => {
    if (await userService.resetPassword(req.body, req.session.email)) {
        res.render('user/reset-password', { alert: { type: 'success', message: 'Làm mới mật khẩu thành công' } });
    }
    else {
        res.render('user/reset-password', { alert: { type: 'danger', message: 'Làm mới mật khẩu thất bại' } });
    }
}