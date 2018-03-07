var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

// Employee Schema
var EmployeeSchema = mongoose.Schema({
  login_number: {
    type: Number,
    required: true,  // length 6-digit number
    unique: true,
    index: true
  },
  email:{
    type: String,
    require: true
  },
  password: {
    type: String,
    required: true
  },
  pin_num: {
    type: Number, // check in app that it is a 4 digit number
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  middle_name: {
    type: String
  },
  last_name: {
    type: String,
    required: true
  },
  ssn: {
    type: String, // need to find out how to search encrypted data
    required: true
  },
  birth_date: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  display_name: {
    type: String,
    required: true,
    unique: true
  },
  hire_date: {
    type: String,
    required: true
  }, // send with the form
  final_day: {
    type: String
  },
  employeed: {
    type: Boolean,
    required: true
  }, // send with the form
  roles: [{
    _id: ObjectId,
    name: String,
    salaried: Boolean,
    rate_of_pay: Number,
    default: Boolean // this will help in-app with drop down boxes
  }], // array of objects
  availability: {
    monday: { start_time: Number, end_time: Number, available: Boolean },
    tuesday: { start_time: Number, end_time: Number, available: Boolean },
    wednesday: { start_time: Number, end_time: Number, available: Boolean },
    thursday: { start_time: Number, end_time: Number, available: Boolean },
    friday: { start_time: Number, end_time: Number, available: Boolean },
    saturday: { start_time: Number, end_time: Number, available: Boolean },
    sunday: { start_time: Number, end_time: Number, available: Boolean }
  }

});

// Virtual for the url of a specific employee
// use this property in templates to view an entire employee record
EmployeeSchema.virtual('url').get(function(){
  return '/employees/'+this.id;
});

var Employee = module.exports = mongoose.model('Employee', EmployeeSchema);

module.exports.createEmployee = function(newEmployee, callback){
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(newEmployee.password, salt, function(err, hash){
      // replace password string with hash string
      newEmployee.password = hash;
      // console.log(newEmployee);
      newEmployee.save(callback);
    });
  });
};

// you could place these in the route
// or encapsulate them in the model
module.exports.getEmployeeByEmployeeNumber = function(login_number, callback){
  // 3: working here so far
  console.log('hey 3');
  var query = {login_number: login_number};
  Employee.findOne(query, callback); // mongoose method
};

//
module.exports.getEmployeeById = function(id, callback){
  Employee.findById(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback){
  console.log('hey 6 - OR: checking password');
  bcrypt.compare(candidatePassword, hash, function(err, isMatch){
    if(err) throw err;

    callback(null, isMatch);
  });
}; // now we need to serialize and deserialize in the route
