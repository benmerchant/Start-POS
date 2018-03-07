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
