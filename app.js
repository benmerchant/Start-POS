var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
// OF COURSE there is a new express validator API
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var async = require('async');


mongoose.connect('mongodb://localhost/startpos');
var db = mongoose.connection;

// routes
var routes = require('./routes/index');
var employees = require('./routes/employees');
var roles = require('./routes/roles');
var menus = require('./routes/menus');

// init app
var app = express();

// set the view engine
app.set('views', path.join(__dirname, 'views')); // set the views folder
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// set Static folder
app.use(express.static(path.join(__dirname, 'public')));

// explain Express session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// init Passport
app.use(passport.initialize());
// piggy back off of the express session set directly above
// there is only one session
app.use(passport.session());

// explain Express Validator
app.use(expressValidator({}));

// connect Flash
// ensures messages sent from server to client are being updated
app.use(flash());

// set some Global Vars for Flash msgs
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); // different than error_msg because Flash sets its own Flash msgs
  // add more globals to signifiy if user is logged in or out
  res.locals.error = req.flash('error');
  // if the employee exists we will be able to access it from anywhere, otherwise null
  res.locals.user = req.user || null;
  next();
});

// Route files Middleware
app.use('/', routes); // mapped to index
app.use('/employees', employees);
app.use('/roles', roles);
app.use('/menus', menus);

// set the port and start the server
app.set('port', (process.env.PORT || 3000));

// listen on the port set above
app.listen(app.get('port'), function(){
  console.log('Server started on port ' + app.get('port'));
})
