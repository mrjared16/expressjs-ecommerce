exports.ensureLoggedIn = (options) => {
    if (typeof options == 'string') {
        options = { redirectTo: options }
    }
    options = options || {};

    const url = options.redirectTo || '/user/login';
    const isReturnTo = (options.isReturnTo === undefined) ? false : options.isReturnTo;
    const message = options.message === undefined ? undefined : options.message;

    return function (req, res, next) {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            if (isReturnTo && req.session) {
                req.session.returnTo = req.originalUrl || req.url;
            }
            if (message) {
                req.flash('alert', 'danger');
                req.flash('alert', message);
            }
            return res.redirect(url);
        }
        next();
    }
}
exports.ensureNotLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return res.redirect('/');
    next();
}