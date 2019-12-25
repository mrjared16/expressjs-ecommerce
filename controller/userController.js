const userService = require('../models/userService');

exports.getLogin = (req, res) => {
    res.render('user/login');
}

exports.postLogin = (req, res) => {
    req.session.username = req.body.username;
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
    res.render('user/forgetPassword');
}

//TODO
exports.postForgetPass = async (req, res) => {
    req.session.email = req.body.email;
    if (await userService.forgetPassword(req.body)) {
        res.render('user/forgetPassword', { alert: { type: 'success', message: 'Đã gửi đến email của bạn' } });;
    }
    else {
        res.render('user/forgetPassword', { alert: { type: 'danger', message: 'Email không tồn tại' } });;
    }
}

exports.logout = (req, res) => {
    req.session.destroy(function(err) {
      req.logout();
      res.redirect('/');
    })
}

exports.history = (req, res) => {
    res.render('dashboard/history');
};

exports.address = (req, res) => {
    res.render('dashboard/address');
};

exports.getProfile = async (req, res) => {
    const userInfo = await userService.getUserInfo(req.session.username);
    if (userInfo != false) {
      res.render('dashboard/profile', {fullname: userInfo.fullname, phone: userInfo.phone}); // address: userInfo.address
    } else {
      res.redirect('/');
    }
};

exports.postProfile = async (req, res) => {
    const userInfo = await userService.postUserInfo(req.session.username, {fullname: req.body.full_name, phone: req.body.phone_number}); //address: req.body.user_adress
    if (userInfo != false) {
      res.render('dashboard/profile', {fullname: req.body.full_name, phone: req.body.phone_number}); // address: req.body.user_adress
    } else {
      res.redirect('/');
    }
};

exports.getResetPass = (req, res) => {
    if (req.session.email != null) {
      res.render('user/resetPassword');
    } else {
      res.redirect('/');
    }
}

exports.postResetPass = async (req, res) => {
    if (await userService.resetPassword(req.body, req.session.email)) {
        res.render('user/resetPassword', { alert: { type: 'success', message: 'Làm mới mật khẩu thành công' } });
    }
    else {
        res.render('user/resetPassword', { alert: { type: 'danger', message: 'Làm mới mật khẩu thất bại' } });
    }
}

exports.getChangePass = (req, res) => {
    if (req.session.username != null) {
      res.render('dashboard/changePass');
    } else {
      res.redirect('/');
    }
}

exports.postChangePass = async (req, res) => {
    const isOk = await userService.postChangePassword(req.session.username, req.body.oldPass, req.body.newPass, req.body.comfirmPass);
    if (isOk) {
      req.session.destroy(function(err) {
        res.redirect('/user/login');
      });
    } else {
      res.render('dashboard/changePass', { alert: { type: 'danger', message: 'Thay đổi mật khẩu thất bại' } });
    }
}
