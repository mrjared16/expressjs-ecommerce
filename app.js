var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var checkoutRouter = require('./routes/checkout');
var dashboardRouter = require('./routes/dashboard');

var app = express();

//const mongoDB = 'mongodb://localhost/ecommerce';
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log('connected database');
});

var handlebars = require('express-handlebars');
app.engine('hbs', handlebars({ extname: '.hbs' }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));

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
