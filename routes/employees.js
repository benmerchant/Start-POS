var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var Employee = require('../models/employee');
// include the roles model to get roles for create_role_form
var Role = require('../models/role');
// include this model for deactivating an employee
// maybe move this later when we clean up the routes
var Archived_employee = require('../models/archived_employee');


// landing pages for all things a manager can do with employee data
router.get('/', function(req, res){
  // res.send('employee HTML stuff');
  // show all employees on this page
  // filter only employees that are currently employeed
  const query = Employee.find({employeed: true}); // mongoose method
  query.exec(function(err,docs){
    if(err) throw Error;
    // console.log(docs);
    res.render('employees',{
      emps: docs
    });
  });
});

// Login Route
router.get('/login', function(req, res){
  res.render('login'); // render a view to login
});



router.get('/create', function(req, res){
  // id like to have this in the role model
  var query = Role.find({}); // mongoose method
  query.exec(function(err,docs){
    if(err) throw Error;

    res.render('create_employee_form',{
      roles: docs
    });
  });
});



// POST request for creating and employee
router.post('/create',[
  // API - https://github.com/chriso/validator.js
  // figure out priority of error handling (only display one error per field if necessary validation schema?)
  // check('login_number').isLength({min:1}).withMessage('Must enter an employee number'),
  check('email').isEmail().withMessage('Enter a valid email address'),
  check('login_number').isLength({min:6, max:6}).withMessage('Employee number must be exactly 6 digits'),
  check('login_number').isInt().withMessage('Employee number can only contain numbers'),
  check('password').isLength({min:8}).withMessage('Please enter at least a 8 character temp password'),
  check('first_name').isLength({min:1}).withMessage('Must enter a First Name'),
  check('last_name').isLength({min:1}).withMessage('Must enter a Last Name'),
  check('ssn').isLength({min:9, max:9}).withMessage('SSN must be 9 numbers'),
  check('ssn').isInt().withMessage('SSN can only contain numbers'),
  check('birth_date').isLength({min:1}).withMessage('Must enter a 8 digit date date.'),
  check('genderSelect').exists().withMessage('Please enter a gender'),
  check('roleSelect').exists().withMessage('No roll. This message should never display.')


], (req, res, next) => {
  // get the validation result
  const errors = validationResult(req);
  // check for validation errors
  if(!errors.isEmpty()){
    console.log(errors.array()); // Jesus! finally. There is no tutorial for new API yet
    // id like to have this in the role model
    var query = Role.find({}); // mongoose method
    query.exec(function(err,docs){
      if(err) throw Error;

      res.render('create_employee_form',{
        roles: docs,
        errors: errors.array()
      });
    });

  } else {
    const checkData = matchedData(req); // validated data only
    // generate a PIN in the createEmployee method
    // console.log(checkData);
    // parse the role string
    var roleArray = checkData.roleSelect.split(' - ');
    // create PIN from YYYY of date
    var empPin = checkData.birth_date.substring(0,4);
    // create display name firstname + first letter of last
    var displayName = checkData.first_name + ' ' + checkData.last_name.substring(0,1);

    // create a new emp obj to send to the method for adding to db
    const newEmployee = new Employee({
      email: checkData.email,
      login_number: checkData.login_number,
      password: checkData.password,
      display_name: displayName,
      pin_num: empPin,
      first_name: checkData.first_name,
      // middle_name: checkData.middle_name,
      last_name: checkData.last_name,
      ssn: checkData.ssn,
      gender: checkData.genderSelect,
      birth_date: new Date(checkData.birth_date),
      roles: [ {
        _id: roleArray[2],
        name: roleArray[0],
        rate_of_pay: roleArray[1],
        default: true // whatever you are hired in as is your default position
      }],
      hire_date: new Date(), // hired today!
      employeed: true // if youre hired today, you must be employeed logic AF
    });
    // console.log(newEmployee);
    // method stored in the Employee Model
    Employee.createEmployee(newEmployee, function(err, employee){
      if(err) throw err;
      console.log(employee);
      // success msg
      // in order for this msg to show, we need a placeholder in our layout template
      req.flash('success_msg', 'Successfully added a new employee');

      // reidrect
      res.redirect('/employees');
    });

  }
});

router.get('/deactivate',(req,res)=>{
  const query = Employee.find({});
  query.exec((err,docs)=>{
    if(err) throw Error;
    console.log(docs);
    res.render('employee_deactivate',{
      emps: docs
    });
  });

});

router.get('/change-availability/:id',(req,res)=>{
  Employee.getEmployeeById(req.params.id,(err,doc)=>{
    if(err) throw err;
    console.log(doc);
    // during handlebar iteration, getting $init, toObject, toJSON from mongoose
    // reform the avaiblity object
    // console.log(doc.availability);
    let days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
    let newAvailabilityObject = {};
    for(let prop in doc.availability){
      if(days.includes(prop)){
        newAvailabilityObject[prop] = doc.availability[prop];
      }
    }
    console.log(newAvailabilityObject);



    res.render('emp-availability',{
      emp : doc,
      availability: newAvailabilityObject
    });

  });
});

router.post('/change-availability/:id',[
  check('monday_bool').exists().withMessage('Monday checkbox error').optional(),
  check('tuesday_bool').exists().withMessage('Tuesday checkbox error').optional(),
  check('wednesday_bool').exists().withMessage('Wednesday checkbox error').optional(),
  check('thursday_bool').exists().withMessage('Thursday checkbox error').optional(),
  check('friday_bool').exists().withMessage('Friday checkbox error').optional(),
  check('saturday_bool').exists().withMessage('Saturday checkbox error').optional(),
  check('sunday_bool').exists().withMessage('Sunday checkbox error').optional(),
  check('monday_start').isLength({ min: 5 }).withMessage('Monday start time ERROR').optional(),
  check('tuesday_start').isLength({ min: 5 }).withMessage('Tueday start time ERROR').optional(),
  check('wednesday_start').isLength({ min: 5 }).withMessage('Wednesday start time ERROR').optional(),
  check('thursday_start').isLength({ min: 5 }).withMessage('Thursday start time ERROR').optional(),
  check('friday_start').isLength({ min: 5 }).withMessage('Friday start time ERROR').optional(),
  check('saturday_start').isLength({ min: 5 }).withMessage('Saturday start time ERROR').optional(),
  check('sunday_start').isLength({ min: 5 }).withMessage('Sunday start time ERROR').optional(),
  check('monday_end').isLength({ min: 5 }).withMessage('Monday end time ERROR').optional(),
  check('tuesday_end').isLength({ min: 5 }).withMessage('Tueday end time ERROR').optional(),
  check('wednesday_end').isLength({ min: 5 }).withMessage('Wednesday end time ERROR').optional(),
  check('thursday_end').isLength({ min: 5 }).withMessage('Thursday end time ERROR').optional(),
  check('friday_end').isLength({ min: 5 }).withMessage('Friday end time ERROR').optional(),
  check('saturday_end').isLength({ min: 5 }).withMessage('Saturday end time ERROR').optional(),
  check('sunday_end').isLength({ min: 5 }).withMessage('Sunday end time ERROR').optional()
  // min length for times due to bootstrap formatting of the string dates
  // format '00:00' military time. 5 chars including the colon
],(req,res)=>{
  console.log(req.body);
  const errors = validationResult(req);
  let days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  if(!errors.isEmpty()){
    // console.log(errors.array());
    Employee.getEmployeeById(req.params.id,(err,doc)=>{
      if(err) throw err;
      let newAvailabilityObject = {};
      for(let prop in doc.availability){
        if(days.includes(prop)){
          newAvailabilityObject[prop] = doc.availability[prop];
        }
      }
      // for sticky form
      // for(let prop in req.body){
      //   if(Number.isInteger(parseInt(req.body[prop]))){
      //     console.log(req.body[prop]);
      //   }
      //
      // }
      res.render('emp-availability',{
        emp : doc,
        availability: newAvailabilityObject,
        errors: errors.array()
      });

    });
  }else{ // no errors
    const checkData = matchedData(req);
    let availabilityOut = {};
    // console.log(checkData.monday_bool);

    // loop through each day and check if the box is checked
    days.forEach((day)=>{
      let day_bool = day + '_bool';
      if(checkData[day_bool]){
        // only set _start and _end unless box is checked
        let day_start = day + '_start';
        let day_end = day + '_end';
        console.log(day + ': ' +checkData[day_start] +' to ' +checkData[day_end]);
        availabilityOut[day] = {available: true};
        availabilityOut[day].start_time = checkData[day_start];
        availabilityOut[day].end_time = checkData[day_end];
      } else {
        console.log('Emp is not available on '+ day);
        availabilityOut[day_bool] = {available: true};
      }
    });

    let updateObject = {availability: availabilityOut};
    // console.log(updateObject);
    Employee.updateEmployee(req.params.id,updateObject,(err,doc)=>{
      if(err) throw err;
      console.log('updated employee available');
      console.log(doc);
      res.redirect('/employees/'+req.params.id);
    });
    // availabilityOut = {};
    // if(checkData.monday_bool){
    //   availabilityOut.monday = { available: true};
    //   availabilityOut.monday.start_time =  checkData.monday_start;
    //   availabilityOut.monday.end_time =  checkData.monday_end;
    //
    //   var updateObject = {availability: availabilityOut}
    //   Employee.updateEmployee(req.params.id,updateObject,(err,doc)=>{
    //     if(err) throw err;
    //     console.log('updated employee available');
    //     console.log(doc);
    //     res.send('update this');
    //   });
    // } else {
    //   availabilityOut.monday = { available: false };
    //
    //   var updateObject = {availability: availabilityOut};
    //   console.log(updateObject);
    //   Employee.updateEmployee(req.params.id,updateObject,(err,doc)=>{
    //     if(err) throw err;
    //     console.log('updated employee unavailable');
    //     console.log(doc);
    //     res.send('update this unavailable on monday');
    //   });
    // }
  }
});


// you can get to this POST one of two ways
// after selecting an employee from the vertical menu
// or by clicking the link on an employee detail page
router.post('/deactivate/:id',(req,res)=>{
  // req.params only includes the ID of the emp passed thru POST in the URL
  const empID = req.params.id;
  // find employee in question
  const query = Employee.findById(empID);
  query.exec((err,doc)=>{
    if(err) throw Error;
    console.log('employee to be archived');
    console.log(doc);
    const newArchived_employee = new Archived_employee({
      _id: doc.login_number,
      email: doc.email,
      password: doc.password,
      first_name: doc.first_name,
      last_name: doc.last_name,
      ssn: doc.ssn,
      birth_date: doc.birth_date,
      gender: doc.gender,
      hire_date: doc.hire_date,
      final_day: new Date(), // makes today the last day
      roles: doc.roles,
      employeed: false
    });
    Archived_employee.archiveEmployee(newArchived_employee,(err,archived_employee)=>{
      if(err) throw err;
      console.log(archived_employee);
      // employeed added to archived_employee collection
      // now remove it from employee collection
      const removeQuery = Employee.remove({_id: empID});
      removeQuery.exec((err)=>{
        if(err) throw err;
        console.log('employee removed from active DB');
        req.flash('success_msg', 'Employee successfully deactivated');
        res.redirect('/employees');
      });
    }); // not ACID compliant......
  });
});



// create a logout route
router.get('/logout', (req, res)=>{
  req.logout();
  // you might not want this notification when someone just goes to your url
  req.flash('success_msg', 'You are logged out');

  res.redirect('/employees/login');
});


//////////////////////////////////////////
///// why does logout work here but not below????
//////////////////////////////////////////



// route for GET one specific employee
router.get('/:id',(req,res,next)=>{
  // need to start using async
  // find out how to implement!!! it worked when i tried last june
  // console.log(req.params.id);
  var query = Employee.findById(req.params.id);
  query.exec(function(err,doc){
    if(err) throw Error;
    console.log('Find one Employee by ID');
    console.log(doc);

    res.render('employee_detail',{
      title: 'Admire your great employee',
      emp: doc
    });
  });
});



// view for updating an employee
router.get('/:id/update',function(req,res,next){
  var query = Employee.findById(req.params.id);
  query.exec(function(err,doc){
    if(err) throw Error;
    console.log('Employee to be updated');
    console.log(doc);

    res.render('employee_update',{
      title: "Update employee info for",
      emp:doc
    });
  });
});
// PUT request to update Employee Info
router.post('/:id/update',[
  // got an answer from github on how to deal with my dynamic jQuery form
  // just make some fields optional
  check('first_name').isLength({min:1}).withMessage('Must enter a first name').optional(),
  check('last_name').isLength({min:1}).withMessage('Must enter a last name').optional()
], (req,res,next)=>{
  const errors = validationResult(req);

  // is there a better way to re-send employee doc to the page to generate fields?
  // perhaps send the doc via req
  if(!errors.isEmpty()){
    console.log(errors.array());
    var query = Employee.findById(req.params.id);
    query.exec((err,doc)=>{
      if(err) throw Error;

      res.render('employee_update',{
        title: "Update employee info",
        errors: errors.array(),
        emp: doc
      });
    });
  } else {
    const checkData = matchedData(req);
    console.log(checkData);
    // move to the model
    // just wrote for availability, should work here too
    var query = Employee.findOneAndUpdate({_id:req.params.id},checkData);
    query.exec((err,doc)=>{
      if(err) throw Error;
      res.redirect('/employees/'+req.params.id);
    });
  }
});


// route to delete an employee
// note, this doesn't delete the employee, it merely changes employeed: false
// this way it wont show up in the Employees view


// strategy must come before login POST request
passport.use(new LocalStrategy({
  // rename fields
  // By default, LocalStrategy expects to find credentials in parameters named
  // username and password. If your site prefers to name these fields differently,
  // options are available to change the defaults.
  usernameField: 'login_number'
  // passwordField: 'password'
},
  function(login_number, password, done){
    // 2: working to here so far
    console.log('hey 2');
    Employee.getEmployeeByEmployeeNumber(login_number, function(err,user){
      // 4: working here so far
      console.log('hey 4');
      if(err) throw err;
      // if there is no username match
      if(!user){
        // 5: working here so far
        console.log('hey 5 - OR: username not in DB');
        return done(null, false, {message: 'Employee number not in DB.'});
      }
      // continue if there is an employee match
      console.log('hey 5 - OR: found employee');
      // user.password is the hashed password from the DB
      // remember, user is just the session global variable
      Employee.comparePassword(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          console.log('hey 7 - OR: passwords match');
          return done(null, user);
        } else {
          console.log('hey 7 - OR: passwords dont match');
          return done(null, false, {message: 'That aint the right password'});
        } // BOOM FrickALOOOOOOOOM!!!!! it all works

      });
    });

  }));

// serialize and deserialize
passport.serializeUser(function(user, done){
  // user is a session variable
  done(null, user.id);
});
passport.deserializeUser(function(id, done){
  // create this funcgion inside the model

  Employee.getEmployeeById(id, function(err, user){
    done(err, user);
  });
});









// // pass port authentication
router.post('/login', // entering nonnumbers throws error? mongoose model?
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/employees/login', // 1: working to here so far (changed route to test)
    failureFlash: true
  }),
  function(req,res){
    // if this function gets called, authentication was Successful
    // 'req.employee' contains the autenticated user
    res.redirect('/');
  });



module.exports = router;
