const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressHsb = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');
const MongoStore = require('connect-mongo'); //pass the session
const routes = require('./routes/index');
const userRoutes = require('./routes/user');
//const stripe = require("stripe")("test_Token");


let app = express();
let MONGO_URI = 'mongodb://localhost:27017/shopping';
mongoose.connect(MONGO_URI); //connect / creation if not exist of db_name: shopping
require('./config/passport'); //need to use the passport.js Strategy.
// view engine setup
app.engine('.hbs',expressHsb({defaultLayout: 'layout',extname:'.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator()); //parse the body and refill the parameters from the request body
app.use(cookieParser());
app.use(session({  //secret key to save the sessions, resave - not allowing to save the sessions in server per request,saveUninitialized - the session will be store in server if its true
  secret:'mysupersecret',
  resave:false,
  saveUninitialized:false,
  store: MongoStore.create({mongoUrl: MONGO_URI}),
  cookie: { maxAge:30*60*1000 } //30 minutes to expire cookie
}));
app.use(flash()); //needs the session to be initiziled first - user session
app.use(passport.initialize());
app.use(passport.session()) //use session library - search in google "passport strategies"
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next)
{
  res.locals.login= req.isAuthenticated();
  res.locals.session = req.session; // session variable to access from anywhere
  next();
});
app.use('/user', userRoutes);
app.use('/', routes);

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

module.exports = app;
