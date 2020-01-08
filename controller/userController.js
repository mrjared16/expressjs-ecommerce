const userService = require('../models/userService');
const cartService = require('../models/cartService');
const orderService = require('../models/orderService');
const Util = require('../util');
const passport = require('passport');
const cloudinary = require('../config/cloudinary');
const Datauri = require('datauri');

// // upload file
// // ==========
// const multer = require("multer");
const path = require("path");

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
        console.log("1");
        await userService.sendMailActiveAccount(newUser._id, newUser.email, req.headers.host);
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
    if (await userService.forgetPassword(req.body.email, req.headers.host)) {
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

    let data = [];
    await Promise.all(order.map(async (eachOrder, index) => {
        let store = {
            orderid: eachOrder.id,
            products: []
        }
        await Promise.all(eachOrder.items.map(async (item) => {
            let product = await userService.getInfoProduct(item.product);
            product.quantity = item.quantity;
            product.price = item.unit_price;
            store.products.push(product);
        }))
        data.push(store);
    }
    ));

    const viewModel = {
        order,
        data
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
    let formatDob;
    if (dob) {
        formatDob = new Date(dob);
        formatDob = formatDob.toISOString().substring(0, 10);
    }
    const viewModel = {
        name,
        address,
        phone,
        dob: (formatDob) ? formatDob : null,
        avatar: (avatar) ? avatar : '/static/images/avatar.jpg'
    }
    res.render('dashboard/profile', viewModel);
};

exports.postProfile = async (req, res) => {
    let imageFile = null;
    const dUri = new Datauri();
    dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
    await cloudinary.uploader.upload(dUri.content, { public_id: `avatar/${req.user.id}` })
        .then(result => {
            imageFile = result.url;
            console.log("file: ", result.url);
            // newProduct.assert.img.push(result.url);
        })
        .catch(err => {
            console.log(err);
            return {
                type: 'error',
                message: 'Đã có lỗi xảy ra'
            }
        })

    let invalid = {};
    if (req.body.name == '') {
        invalid.name = "Họ tên không được để trống";
    }
    if (req.body.phone != '' && req.body.phone.length != 10) {
        invalid.phone = "Số điện thoại không hợp lệ";
    }
    const { name, address, phone, dob, avatar } = await userService.updateUserInfo(req.user, req.body, imageFile, invalid);
    let formatDob;
    if (dob) {
        formatDob = new Date(dob);
        formatDob = formatDob.toISOString().substring(0, 10);
    }
    let mess = "";
    if (invalid.name) {
        mess += invalid.name;
    }
    if (invalid.phone) {
        if (mess == "") {
            mess += invalid.phone;
        }
        else {
            mess = mess + '<br>' + invalid.phone;
        }
    }
    const viewModel = {
        name,
        address,
        phone,
        dob: (formatDob) ? formatDob : null,
        avatar: (avatar) ? avatar : '/static/images/avatar.jpg',
        alert: (invalid.name || invalid.phone) ? { type: 'danger', message: mess } : { type: 'success', message: 'Đã lưu lại thông tin' }
    };
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
    const result = await userService.changePassword(req.user._id, req.body.oldPass, req.body.newPass, req.body.confirmPass);
    if (result.isSucess) {
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
