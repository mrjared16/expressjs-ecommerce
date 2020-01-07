module.exports = (req, res, next) => {
    // console.log('custom middleware!');
    if (req.isAuthenticated && req.isAuthenticated()) {
        res.locals.user = req.user;
        // console.log(req.user);
    }
    
    const alert = req.flash('alert');
    if (alert && alert.length) {
        // console.log(alert);
        res.locals.alert = {
            type: alert[0],
            message: alert[1]
        }
    }
    next();
}