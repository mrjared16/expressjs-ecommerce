const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./config/passport');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productRouter = require('./routes/product');
const checkoutRouter = require('./routes/checkout');
const dashboardRouter = require('./routes/dashboard');
const cartRouter = require('./routes/cart');
const commentRouter = require('./routes/comment');

const app = express();

// static file first
app.use('/static', express.static(path.join(__dirname, 'public')));

// config mongoose
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  //const mongoDB = 'mongodb://localhost/ecommerce';
  console.log('connected database');
});

// config handle bars
const handlebars = require('express-handlebars');
app.engine('hbs', handlebars({
  extname: '.hbs',
  helpers: require('./views/helpers')
}));

// config view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// config session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());
// config passport
passportConfig(passport, app);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/product', productRouter);
app.use('/checkout', checkoutRouter);
app.use('/dashboard', dashboardRouter);
app.use('/cart', cartRouter);
app.use('/comment', commentRouter);

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
