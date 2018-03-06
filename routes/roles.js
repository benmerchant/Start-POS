var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var Role = require('../models/role');

// Role Route Index
router.get('/', function(req, res){
  res.render('roles');
});

// come back and work in a controller
router.get('/create', function(req, res){
  res.render('create_role_form');
});


router.post('/create',[
  // exists wasn't working, empty strings were returning as Existing
  check('name').isLength({min:1}).withMessage('Must enter a name for the new Position'),
  check('salaryRadios').exists().withMessage('This message should never show [Radios].'),
  // Not validating radio buttons. just pass req.body
  // nevermind, i was using the wrong name for the field so it didnt exist
  check('rate_of_pay').isLength({min:1}).withMessage('Must enter a rate of pay'),
  check('rate_of_pay').isDecimal().withMessage('Pay rate must be a number')
  // find how to check if a number
  // https://github.com/chriso/validator.js
], (req, res, next) => {
  // get the validation result
  // console.log(req.body);
  const errors = validationResult(req);
  var tryTheseErrors = req.validationErrors();
  console.log(tryTheseErrors);
  if(!errors.isEmpty()){
    // return res.status(400).json({errors: errors.mapped()});
    // res.json({errors: errors.mapped()});
    console.log(errors.mapped());
    res.render('create_role_form',{
      errors: tryTheseErrors
    });
  } else {
    const checkData = matchedData(req);// RETURNS: an obj of ONLY data validated by the check APIs
    console.log(checkData);
    // we've already included the User model above
    var newRole = new Role({
      name: checkData.name,
      salaried: checkData.salaryRadios,
      base_pay: checkData.rate_of_pay
      // auto casts to a number, why? the model schema???
    });

    // we could save directly in thhis route, but its better to keep
    // all functions in the model. like a class based system
    Role.createRole(newRole, function(err,user){
      if(err) throw err;
      console.log('new role created');
    });

    req.flash('success_msg', 'Great job creating a new position for your store');

    res.redirect('/roles');
  }


  // const role = matchedData(req);
  // console.log(role);
  // Role.createRole(role).then(role => res.json(role));


});








module.exports = router;
