var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socket_io = require('socket.io')


var users = require('./routes/users');

var app = express();

var session = require('express-session');
var KnexSessionStore = require('connect-session-knex')(session)
var store = new KnexSessionStore()
// var RedisStore = require('connect-redis')(session);

var io = socket_io()
app.io = io
var routes = require('./routes/index')(io);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    // genid: function(req) {
    //   return genuuid() // use UUIDs for session IDs
    // },
    secret: 'keyboard cat',
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000 // 2 seconds for testing

    },
    store: store
}))
// app.use(session({
//     store: new RedisStore(options),
//     secret: 'abcdefghik123'
// }));


app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

io.on( "connection", function( socket )
{
    console.log( "A user connected" );
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
