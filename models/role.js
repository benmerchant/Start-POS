var mongoose = require('mongoose');

// Role Schema
var RoleSchema = mongoose.Schema({
  name: String,
  salaried: Boolean,
  base_pay: Number
});


var Role = module.exports = mongoose.model('Role', RoleSchema);

module.exports.createRole = function(newRole, callback){
  newRole.save(callback);
};

// get all ids and names for the create_employee_form
// module.exports.getAllRoles = function() {
//   var query = Role.find({});
//
//
// }; // not working
