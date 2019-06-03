const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const sassMiddleware = require('node-sass-middleware');
const logger = require('morgan');
const config = require('config');
const session = require('express-session');
const authController = require('controllers/backend/auth');

const indexRouter = require('./routes/index');
const categoryRouter = require('./routes/category');
const productRouter = require('./routes/product');
// const usersRouter = require('./routes/users');
// const backendRouter = require('./routes/backend');
const backendCountryRouter = require('./routes/backend/country');
const backendBrandRouter = require('./routes/backend/brand');
const backendCategoryRouter = require('./routes/backend/category');
const backendSellerRouter = require('./routes/backend/seller');
const backendProductRouter = require('./routes/backend/product');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: config.get('session:name'),
  resave: false,
  saveUninitialized: false,
  secret: config.get('session:secret'),
  cookie: {
    maxAge: config.get('session:lifetime'),
    sameSite: true,
    secure: config.get('session:in_prod'),
  }
}));

app.use(require('flash')());

app.use(authController.getUserFromDatabaseBySessionUserId);

// Routes prefix
app.use('/', indexRouter);
app.use('/catalog', categoryRouter);
app.use('/product', productRouter);

// Backend routes prefix
// app.use('/backend', backendRouter);
app.use('/backend/country', backendCountryRouter);
app.use('/backend/brand', backendBrandRouter);
app.use('/backend/category', backendCategoryRouter);
app.use('/backend/seller', backendSellerRouter);
app.use('/backend/product', backendProductRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
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

module.exports = app;
