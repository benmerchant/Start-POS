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
    required: true,
    unique: true // forgot to make this unique initially
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
  // removed final_day. doesn't make sense in the context of new design
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
    monday: { start_time: String, end_time: String, available: { type:Boolean, default:false} },
    tuesday: { start_time: String, end_time: String, available: { type:Boolean, default:false} },
    wednesday: { start_time: String, end_time: String, available: { type:Boolean, default:false} },
    thursday: { start_time: String, end_time: String, available: { type:Boolean, default:false} },
    friday: { start_time: String, end_time: String, available: { type:Boolean, default:false} },
    saturday: { start_time: String, end_time: String, available: { type:Boolean, default:false} },
    sunday: { start_time: String, end_time: String, available: { type:Boolean, default:false} }
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

module.exports.getEmployeeByEmail = (email,cb)=>{
  Employee.findOne({email:email},cb);
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

module.exports.updateEmployee = (id,updateObj,cb)=>{
  Employee.findOneAndUpdate(
    {_id:id},
    updateObj,
    {new:true}, // doesn't return updated doc by default
    cb
  );
};

module.exports.cleanUpAvailabilityObject = (availObjIn)=>{
  let days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  let newAvailabilityObject = {};
  for(let prop in availObjIn){
    if(days.includes(prop)){
      newAvailabilityObject[prop] = availObjIn[prop];
    }
  }
  // console.log('check in model');
  // console.log(newAvailabilityObject);
  return(newAvailabilityObject);
};

module.exports.removeRoleFromEmp = (empID,roleID,cb)=>{
  Employee.findOneAndUpdate(
    {_id: empID},
    {$pull: {
      roles:{_id:roleID}
    }},
    {new:true},
    cb
  );
};
