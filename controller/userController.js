exports.getLogin = (req, res) => {
    res.render('user/login');
}

exports.postLogin = (req, res) => {
    res.redirect('/');
}


exports.getRegister = (req, res) => {
    res.render('user/register');
}

exports.postRegister = (req, res) => {
    res.redirect('/');
}


exports.getForgetPass = (req, res) => {
    res.render('user/forget-password');
}

exports.postForgetPass = (req, res) => {
    res.redirect('/');
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