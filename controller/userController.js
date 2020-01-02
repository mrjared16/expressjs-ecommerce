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
    let viewModel = {};
    if (validate.result) {
        await userService.createUser(req.body);
        viewModel = { alert: { type: 'success', message: 'Đăng ký thành công!' } };
    }
    else {
        viewModel = { alert: { type: 'danger', message: `Đăng ký thất bại! ${validate.message}` }};
    }
    res.render('user/register', viewModel);
}


exports.getForgetPass = (req, res) => {
    if (isAuthenticated(req, res)) {
        res.redirect('/dashboard');
        return;
    }

    res.render('user/forget-password');
}

//TODO
exports.postForgetPass = (req, res) => {
    if (isAuthenticated(req, res)) {
        res.redirect('/dashboard');
        return;
    }
    userService.forgetPassword(req.body);
    const viewModel = {
        alert: { type: 'success', message: 'Đã gửi đến email của bạn' }
    };
    res.render('user/register', viewModel);
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

const isAuthenticated = (req, res) => {
    return (req.user) ? true : false;
}

