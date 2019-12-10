const LocalStrategy = require('passport-local').Strategy;
const userService = require('../models/userService');

module.exports = (passport, express) => {
    // Using LocalStrategy with passport
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            try {
                console.log(username, password);
                const user = await userService.getUserByUsername(username);
                console.log(user);
                if (!user) {
                    return done(null, false, { message: 'Unknown User' });
                }

                if (await userService.comparePassword(password, user.password)) {
                    console.log('success');

                    return done(null, user);
                }
                else {
                    console.log('fail');
                    return done(null, false, { message: 'Invalid password' });
                }
            } catch (err) {
                if (err) err;
            }

        }
    ));

    passport.serializeUser(function (user, done) {
        console.log('set', user);
        done(null, user.username);
    });

    passport.deserializeUser(async (username, done) => {
        const user = await userService.getUserByUsername(username);
        done(null, user);
    });
    
    express.use((req, res, next) => {
        if (req.user)
            res.locals.user = req.user;
        next();
    });
}