///filesystem
require('dotenv').config();
var path = require('path');

///express
var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();

///socket
var socket_io = require('socket.io')
var io = socket_io()
app.io = io

///passport
var passport = require('passport')
var FacebookStrategy = require('passport-facebook')

///knex
var Knex = require('knex');
var knexConfig = require(__dirname + '/knexfile')
var knex = Knex(knexConfig[process.env.NODE_ENV || 'development'])

///express route files
var routes = require('./routes/index')(io);
var users = require('./routes/users');
var auth = require('./routes/auth')

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
  secret: 'This is a secret!',
  saveUninitialized: true,
  resave: true,
  db: knex,
  maxAge: 300000
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.DOMAIN + "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    var user = profile
    console.log('profile', profile)
    console.log('cb', cb)
    return cb(null, user)
  }
));

passport.serializeUser(function(user, cb) {
  //this gets called around verification
  console.log("<<  ".green + "I just serialized a user".red, new Date().toJSON() )
  console.log("<<  ", user)
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  // this gets called with req.user
  console.log(">>  ".green + "I just deserialize a user".red)
  console.log(">>  ", obj)
  cb(null, obj);
});

app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth)

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
