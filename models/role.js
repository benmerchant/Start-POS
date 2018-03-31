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

module.exports.getAllRoles = (cb)=>{
  Role.find({},cb);
};
