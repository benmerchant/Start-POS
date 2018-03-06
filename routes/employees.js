var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var Employee = require('../models/employee');
// include the roles model to get roles for create_role_form
var Role = require('../models/role');


// landing pages for all things a manager can do with employee data
router.get('/', function(req, res){
  // res.send('employee HTML stuff');
  res.render('employees');
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
  check('login_number').isLength({min:6, max:6}).withMessage('Employee number must be exactly 6 digits'),
  check('login_number').isInt().withMessage('Employee number can only contain numbers'),
  check('first_name').isLength({min:1}).withMessage('Must enter a First Name'),
  check('last_name').isLength({min:1}).withMessage('Must enter a Last Name'),
  check('ssn').isLength({min:9, max:9}).withMessage('SSN must be 9 numbers'),
  check('ssn').isInt().withMessage('SSN can only contain numbers'),
  check('date').isLength({min:1}).withMessage('Must enter a date.')


], (req, res, next) => {
  // get the validation result
  const errors = validationResult(req);


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

  }



});


module.exports = router;
