exports.getLogin = function(req, res) {
    res.render('user/login');
}

exports.postLogin = function(req, res) {
    res.redirect('/');
}


exports.getRegister = function(req, res) {
    res.render('user/register');
}

exports.postRegister = function(req, res) {
    res.redirect('/');
}


exports.getForgetPass = function(req, res) {
    res.render('user/forget-password');
}

exports.postForgetPass = function(req, res) {
    res.redirect('/');
}

exports.logout = function(req, res) {
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