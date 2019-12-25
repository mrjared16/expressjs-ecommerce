const userService = require('../models/userService');
const passport = require('passport');

exports.getLogin = (req, res) => {
    if (isAuthenticated(req, res)) {
        res.redirect('/dashboard');
        return;
    }
    res.render('user/login');
}

exports.postLogin = (req, res, next) => {
    req.session.username = req.body.username;
    if (isAuthenticated(req, res)) {
        res.redirect('/dashboard');
        return;
    }

    passport.authenticate('local', function (err, user, message) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.render('user/login', { alert: { type: 'danger', message: `${message}` } });
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
}


exports.getRegister = (req, res) => {
    if (isAuthenticated(req, res)) {
        res.redirect('/dashboard');
        return;
    }

    res.render('user/register');
}

exports.postRegister = async (req, res) => {
    if (isAuthenticated(req, res)) {
        res.redirect('/dashboard');
        return;
    }

    const validate = await userService.registerValidate(req.body);
    if (validate.result) {
        await userService.createUser(req.body);
        res.render('user/register', { alert: { type: 'success', message: 'Đăng ký thành công!' } });
    }
    else {
        res.render('user/register', { alert: { type: 'danger', message: `Đăng ký thất bại! ${validate.message}` } });
    }
}


exports.getForgetPass = (req, res) => {
    if (isAuthenticated(req, res)) {
        res.redirect('/dashboard');
        return;
    }

    res.render('user/forget-password');
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
    if (isAuthenticated(req, res)) {
        req.logout();
    }
    res.redirect('/');
}

exports.history = (req, res) => {
    if (!isAuthenticated(req, res)) {
        res.redirect('/');
        return;
    }

    res.render('dashboard/history');
};

exports.address = (req, res) => {
    if (!isAuthenticated(req, res)) {
        res.redirect('/');
        return;
    }

    res.render('dashboard/address');
};

exports.profile = (req, res) => {
    if (!isAuthenticated(req, res)) {
        res.redirect('/');
        return;
    }

    res.render('dashboard/profile');
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

const isAuthenticated = (req, res) => {
    return (req.user) ? true : false;
}
