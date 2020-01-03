const userService = require('../models/userService');
const cartService = require('../models/cartService');
const passport = require('passport');


exports.getLogin = (req, res) => {
    if (userService.isAuthenticated(req, res)) {
        res.redirect('/dashboard');
        return;
    }
    res.render('user/login');
}

exports.postLogin = (req, res, next) => {
    // req.session.username = req.body.username;
    if (userService.isAuthenticated(req, res)) {
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
        req.logIn(user, async function (err) {
            await cartService.insertLocalToDatabase(req);
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
}


exports.getRegister = (req, res) => {
    if (userService.isAuthenticated(req, res)) {
        res.redirect('/dashboard');
        return;
    }

    res.render('user/register');
}

exports.postRegister = async (req, res) => {
    if (userService.isAuthenticated(req, res)) {
        res.redirect('/dashboard');
        return;
    }

    const validate = await userService.registerValidate(req.body);
    let viewModel = {};
    if (validate.result) {
        const newUser = await userService.createUser(req.body);
        await userService.sendMailActiveAccount(newUser._id, newUser.email);
        viewModel = { alert: { type: 'success', message: 'Đăng ký thành công! Hãy vào email của bạn để kích hoạt tài khoản' } };
    }
    else {
        viewModel = { alert: { type: 'danger', message: `Đăng ký thất bại! ${validate.message}` } };
    }
    res.render('user/register', viewModel);
}


exports.getForgetPass = (req, res) => {
    if (userService.isAuthenticated(req, res)) {
        res.redirect('/dashboard');
        return;
    }

    res.render('user/forgetPassword');
}

//TODO
exports.postForgetPass = async (req, res) => {
    if (await userService.forgetPassword(req.body.email)) {
        res.render('user/forgetPassword', { alert: { type: 'success', message: 'Đã gửi đến email của bạn' } });;
    }
    else {
        res.render('user/forgetPassword', { alert: { type: 'danger', message: 'Email không tồn tại' } });;
    }
}

exports.logout = (req, res) => {
    if (userService.isAuthenticated(req, res)) {
        req.logout();
        req.session.cart = null;
        req.app.locals.itemsInMyCart = null;
        req.app.locals.totalPrice = null;
    }
    res.redirect('/');
}

exports.history = (req, res) => {
    if (!userService.isAuthenticated(req, res)) {
        res.redirect('/');
        return;
    }

    res.render('dashboard/history');
};

exports.address = (req, res) => {
    if (!userService.isAuthenticated(req, res)) {
        res.redirect('/');
        return;
    }

    res.render('dashboard/address');
};

// exports.profile = (req, res) => {
//     if (!userService.isAuthenticated(req, res)) {
//         res.redirect('/');
//         return;
//     }
//
//     res.render('dashboard/profile');
// };

exports.getProfile = async (req, res) => {
    if (!userService.isAuthenticated(req, res)) {
        res.redirect('/');
    }
    const userInfo = await userService.getUserInfo(req.user._id);
    if (userInfo != false) {
        res.render('dashboard/profile', { fullname: userInfo.fullname, phone: userInfo.phone }); // address: userInfo.address
    } else {
        res.redirect('/');
    }
};

exports.postProfile = async (req, res) => {
    const userInfo = await userService.postUserInfo(req.user._id, { fullname: req.body.full_name, phone: req.body.phone_number }); //address: req.body.user_adress
    if (userInfo != false) {
        res.render('dashboard/profile', { fullname: req.body.full_name, phone: req.body.phone_number, alert: { type: 'success', message: 'Đã lưu lại thông tin' } }); // address: req.body.user_adress
    } else {
        res.redirect('/');
    }
};

exports.getResetPass = (req, res) => {
    // Xu ly lai
    if (true) {
        res.render('user/resetPassword');
    } else {
        res.redirect('/');
    }
}

exports.postResetPass = async (req, res) => {
    if (await userService.resetPassword(req.body, req.params.id)) {
        res.render('user/resetPassword', { alert: { type: 'success', message: 'Làm mới mật khẩu thành công' } });
    }
    else {
        res.render('user/resetPassword', { alert: { type: 'danger', message: 'Làm mới mật khẩu thất bại' } });
    }
}

exports.getChangePass = (req, res) => {
    if (userService.isAuthenticated(req, res)) {
        res.render('dashboard/changePass');
    } else {
        res.redirect('/');
    }
}

exports.postChangePass = async (req, res) => {
    const isOk = await userService.changePassword(req.user._id, req.body.oldPass, req.body.newPass, req.body.confirmPass);
    if (isOk) {
        req.session.destroy(function (err) {
            res.redirect('/user/login');
        });
    } else {
        console.log("3");
        res.render('dashboard/changePass', { alert: { type: 'danger', message: 'Thay đổi mật khẩu thất bại' } });
    }
}

exports.getActiveAccout = async (req, res) => {
    await userService.activeAccout(req.params.id);
    res.redirect('/user/login');
}

