const userService = require('../models/userService');
const cartService = require('../models/cartService');
const orderService = require('../models/orderService');
const passport = require('passport');


exports.getLogin = (req, res) => {
    if (userService.isAuthenticated(req, res)) {
        res.redirect('/dashboard');
        return;
    }
    res.render('user/login');
}

exports.postLogin = (req, res, next) => {

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

exports.history = async (req, res) => {
    if (!userService.isAuthenticated(req, res)) {
        res.redirect('/');
        return;
    }
    const user = req.user;
    const getDateFormat = (date) => {
        const _date = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        return `${_date}/${month}/${year}, ${hour}:${minute}:${second}`;
    }
    const order = (await orderService.getAllOrder(user)).map(item => {
        item.date = getDateFormat(item.createdAt);
        return item;
    })
    const viewModel = {
        order
    };
    res.render('dashboard/history', viewModel);
};

exports.address = async (req, res) => {
    if (!userService.isAuthenticated(req, res)) {
        res.redirect('/');
        return;
    }
    const { shippingAddress } = req.user;
    const viewModel = {
        shippingAddress
    }
    res.render('dashboard/address', viewModel);
};

exports.getProfile = async (req, res) => {
    if (!userService.isAuthenticated(req, res)) {
        res.redirect('/');
    }
    const { name, address, phone, dob, avatar } = req.user;
    let formatDob = new Date(dob);
    formatDob = formatDob.toISOString().substring(0, 10);
    const viewModel = {
        name,
        address,
        phone,
        dob: formatDob,
        avatar: (avatar) ? avatar : '/static/images/avatar.jpg'
    }
    res.render('dashboard/profile', viewModel);
};

exports.postProfile = async (req, res) => {
    const { name, address, phone, dob, avatar } = await userService.updateUserInfo(req.user, req.body);
    let formatDob = new Date(dob);
    formatDob = formatDob.toISOString().substring(0, 10);
    const viewModel = {
        name,
        address,
        phone,
        dob: formatDob,
        avatar: (avatar) ? avatar : '/static/images/avatar.jpg',
        alert: { type: 'success', message: 'Đã lưu lại thông tin' }
    };

    res.render('dashboard/profile', viewModel);
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
