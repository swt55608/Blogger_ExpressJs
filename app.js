var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

const redis = require('redis');
const redisClient = redis.createClient();
const RedisStore = require('connect-redis')(session);

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blogger', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', () => console.error('Could not connect to MongoDB'));
db.on('open', () => console.log('Connected to MongoDB'));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let authorManagementRouter = require('./routes/authorManagement');
let articlesRouter = require('./routes/articlesRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new RedisStore({client: redisClient}),
  resave: false,
  saveUninitialized: true,
  secret: generateRandomString(50),
  cookie: {maxAge: 2 * 60 * 1000, httpOnly: true}
}));

app.locals.applicationScope = {};

app.use(function(req, res, next) {
  res.locals.requestScope = {};
  res.locals.sessionScope = req.session;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/authorManagement', authorManagementRouter);
app.use('/articles', articlesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function generateRandomString(length = 10) {
  let ret = "";
  for (let i = 0; i < length; i++) {
      ret += String.fromCharCode(Math.floor(Math.random() * (126 - 32)) + 32);
  }
  return ret;
}

module.exports = app;
