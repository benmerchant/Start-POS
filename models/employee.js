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
    role_id: ObjectId,
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
