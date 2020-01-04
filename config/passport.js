const LocalStrategy = require('passport-local').Strategy;
const userService = require('../models/userService');

module.exports = (passport, express) => {
    // Using LocalStrategy with passport
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            let user;
            try {
                user = await userService.getUserByUsername(username);
                if (!user) {
                    return done(null, false, 'Không tìm thấy tên tài khoản');
                }
            } catch (err) {
                if (err)
                    return done(err);
            }

            if (!await userService.comparePassword(password, user.password)) {
                return done(null, false, 'Sai mật khẩu');
            }

            if (!user.active) {
                return done(null, false, 'Tài khoản chưa kích hoạt');
            }
            return done(null, user);
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user.username);
    });

    passport.deserializeUser(async (username, done) => {
        try {
            const user = await userService.getUserByUsername(username);
            if (!user) {
                return done(new Error('user not found'));
            }
            done(null, user);
        } catch (e) {
            done(e);
        }

    });

    express.use((req, res, next) => {
        if (req.user)
            res.locals.user = req.user;
        next();
    });
}
