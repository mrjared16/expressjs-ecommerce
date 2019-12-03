var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
var session = require('express-session');
var passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var checkoutRouter = require('./routes/checkout');
var dashboardRouter = require('./routes/dashboard');
const userService = require('./models/userService');
var app = express();

//const mongoDB = 'mongodb://localhost/ecommerce';
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log('connected database');
});

var handlebars = require('express-handlebars');
app.engine('hbs', handlebars({
  extname: '.hbs',
  helpers: require('./views/helpers') //only need this
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));
// Using LocalStrategy with passport
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
  function (username, password, done) {
    userService.getUserByUsername(username, function (err, user) {
      console.log('checking');
      if (err) err;
      if (!user) {
        return done(null, false, { message: 'Unknown User' });
      }
      console.log('checking password');
      userService.comparePassword(password, user.password, function (err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          console.log('login');
          console.log(user);
          return done(null, user);
        } else {
          console.log('not login');
          return done(null, false, { message: 'Invalid password' });
        }
      });
    });
  }
));

passport.serializeUser(function (user, done) {
  console.log("get");
  done(null, user.username);
});

passport.deserializeUser(function (username, done) {
  console.log("get user");
  userService.getUserByUsername(username, function (err, user) {
    console.log("get done");
    done(err, user);
  });
});

// Passport init
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  if (req.user) res.locals.user = req.user; next();
});
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/product', productRouter);
app.use('/checkout', checkoutRouter);
app.use('/dashboard', dashboardRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
