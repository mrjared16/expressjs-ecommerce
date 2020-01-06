const userService = require('../models/userService');
const cartService = require('../models/cartService');
const orderService = require('../models/orderService');
const Util = require('../util');
const passport = require('passport');


exports.getLogin = (req, res) => {
    res.render('user/login');
}

exports.postLogin = (req, res, next) => {
    passport.authenticate('local', function (err, user, message) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('alert', 'danger');
            req.flash('alert', message);
            return res.redirect('/user/login');
        }
        req.logIn(user, async function (err) {
            await cartService.insertLocalToDatabase(req);
            if (err) {
                return next(err);
            }
            const url = req.session.returnTo || '/';
            delete req.session.returnTo;
            return res.redirect(url);
        });
    })(req, res, next);
}


exports.getRegister = (req, res) => {
    res.render('user/register');
}

exports.postRegister = async (req, res) => {
    const validate = await userService.registerValidate(req.body);

    if (validate.result) {
        const newUser = await userService.createUser(req.body);
        await userService.sendMailActiveAccount(newUser._id, newUser.email);
        req.flash('alert', 'success');
        req.flash('alert', 'Đăng ký thành công! Hãy vào email của bạn để kích hoạt tài khoản');
    }
    else {
        req.flash('alert', 'danger');
        req.flash('alert', `Đăng ký thất bại! ${validate.message}`);
    }

    res.redirect('/user/register');
}


exports.getForgetPass = (req, res) => {
    res.render('user/forgetPassword');
}

exports.postForgetPass = async (req, res) => {
    if (await userService.forgetPassword(req.body.email)) {
        req.flash('alert', 'success');
        req.flash('alert', 'Đã gửi đến email của bạn');
    }
    else {
        req.flash('alert', 'danger');
        req.flash('alert', 'Email không tồn tại');
    }
    res.redirect('/user/forgetPassword');
}

exports.logout = (req, res) => {
    req.logout();
    req.session.cart = null;
    res.redirect('/');
}

exports.history = async (req, res) => {
    const user = req.user;
    
    const order = (await orderService.getAllOrder(user)).map(item => {
        item.date = Util.getDateFormat(item.createdAt);
        return item;
    })
    const viewModel = {
        order
    };
    res.render('dashboard/history', viewModel);
};

exports.address = async (req, res) => {
    const { shippingAddress } = req.user;
    const viewModel = {
        shippingAddress
    }
    res.render('dashboard/address', viewModel);
};

exports.getProfile = async (req, res) => {
    const { name, address, phone, dob, avatar } = req.user;
    const viewModel = {
        name,
        address,
        phone,
        dob,
        avatar: (avatar) ? avatar : '/static/images/avatar.jpg'
    }
    res.render('dashboard/profile', viewModel);
};

exports.postProfile = async (req, res) => {
    await userService.updateUserInfo(req.user, req.body);

    req.flash('alert', 'success');
    req.flash('alert', 'Đã lưu lại thông tin');

    res.redirect('/user/profile');
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
        req.flash('alert', 'success');
        req.flash('alert', 'Làm mới mật khẩu thành công');
    }
    else {
        req.flash('alert', 'danger');
        req.flash('alert', 'Làm mới mật khẩu thất bại');
    }
    res.redirect('/user/resetPassword');
}

exports.getChangePass = (req, res) => {
    res.render('dashboard/changePass');
}

exports.postChangePass = async (req, res) => {
    const isOk = await userService.changePassword(req.user._id, req.body.oldPass, req.body.newPass, req.body.confirmPass);
    if (isOk) {
        // req.session.destroy(function (err) {
        //     res.redirect('/user/login');
        // });
        req.flash('alert', 'success');
        req.flash('alert', 'Thay đổi mật khẩu thành công');
    }
    else {
        req.flash('alert', 'danger');
        req.flash('alert', 'Thay đổi mật khẩu thất bại');
    }
    res.redirect('/user/changePass');
}


exports.getActiveAccount = async (req, res) => {
    await userService.activeAccout(req.params.id);
    res.redirect('/user/login');
}
