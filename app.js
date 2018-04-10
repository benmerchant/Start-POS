const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
// OF COURSE there is a new express validator API
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const async = require('async');
const cors = require('cors');



mongoose.connect('mongodb://localhost/startpos');
var db = mongoose.connection;

// routes
const routes = require('./routes/index');
const employees = require('./routes/employees');
const roles = require('./routes/roles');
const menus = require('./routes/menus');
const schedules = require('./routes/schedules');
const restaurants = require('./routes/restaurants');
const orders = require('./routes/orders');

// init app
const app = express();

// enable cors
app.use(cors({
  origin: 'http://localhost:3000'
}));

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
app.use('/',routes); // mapped to index
app.use('/employees',employees);
app.use('/roles',roles);
app.use('/menus',menus);
app.use('/schedules',schedules);
app.use('/restaurants',restaurants);
app.use('/orders',orders);

// set the port and start the server
app.set('port', (process.env.PORT || 3000));

// listen on the port set above
app.listen(app.get('port'), function(){
  console.log('Server started on port ' + app.get('port'));
})
