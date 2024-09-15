var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');

var config = require('./config.json');

//set up some helpful urls
config.urls = {
  "discordLogin": new URL("discordLogin", config.service.url).href,
  "login": new URL("login", config.service.url).href,
  "success": new URL("success", config.service.url).href,
  "unauthorized": new URL("unauthorized", config.service.url).href
}


var indexRouter = require('./routes/index')(config);
var discordLoginRouter = require('./routes/discordLogin')(config);
var omadaLoginRouter = require('./routes/omadaLogin')(config);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/discordLogin', discordLoginRouter);
app.use('/login', omadaLoginRouter);

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
  res.render('error', { status : err.status, message: err.message, stack : err.stack });
});

module.exports = app;

app.listen(config.service.port, () => console.log(`App listening at ${config.service.url}`));