var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var Archived_employeeSchema = mongoose.Schema({
  _id: { // login_number from Employee schema
    type: Number,
    required: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
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
    unique: true
  },
  birth_date: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  employeed: {
    type: Boolean,
    required: true
  },
  hire_date: {
    type: String,
    required: true
  },
  final_day: {
    type: String,
    required: true
  },
  roles: [{
    _id: ObjectId,
    name: String,
    salaried: Boolean,
    rate_of_pay: Number,
    default: Boolean // this will help in-app with drop down boxes
  }]
});

Archived_employeeSchema.virtual('url').get(function(){
  return '/employees/'+this.id;
});

var Archived_employee = module.exports = mongoose.model('Archived_employee', Archived_employeeSchema);

module.exports.archiveEmployee = (newArchived_employee, callback)=>{
  newArchived_employee.save(callback);
};

module.exports.getAllArchived = (cb)=>{
  Archived_employee.find({}).lean().exec(cb);
};

module.exports.findOneByLoginNumber = (login_number,cb)=>{
  Archived_employee.findOne({_id:login_number}).exec(cb);
};

module.exports.removeFromArchive = (login_number,cb)=>{
  Archived_employee.remove({_id:login_number}).exec(cb);
};
