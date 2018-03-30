const mongoose = require('mongoose');

// this is for the overall menu not each item
const MenuSchema = mongoose.Schema({
  menu_heading: {
    type: String,
    required: true,
    unique: true,
    index: true
  }
});

var Menu = module.exports = mongoose.model('Menu', MenuSchema);

module.exports.createMenuHeading = (newMenuHeading, callback)=>{
  newMenuHeading.save(callback);
};

module.exports.getAllHeadings = (queryObj,callback)=>{
  Menu.find({}).exec(callback);
};

module.exports.deleteHeading = (queryObj,cb)=>{
  Menu.remove(queryObj).exec(cb);
};
