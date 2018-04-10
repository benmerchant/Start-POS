const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var RestaurantSchema = mongoose.Schema({
  store_number: {
    type: Number,
    required: true,
    unique: true,
    index:true
  },
  name: {
    type: String,
    requred: true
  },
  state_tax: {
    type: Number,
    required: true
  },
  local_tax: {
    type: Number,
    required: true
  },
  store_hours: {
    monday: { start_time: String, end_time: String, open: { type:Boolean, default:false} },
    tuesday: { start_time: String, end_time: String, open: { type:Boolean, default:false} },
    wednesday: { start_time: String, end_time: String, open: { type:Boolean, default:false} },
    thursday: { start_time: String, end_time: String, open: { type:Boolean, default:false} },
    friday: { start_time: String, end_time: String, open: { type:Boolean, default:false} },
    saturday: { start_time: String, end_time: String, open: { type:Boolean, default:false} },
    sunday: { start_time: String, end_time: String, open: { type:Boolean, default:false} }
  },
  dining_areas: [{
    name: {type:String},
    tables:[{
      name: {type:String},
      seats: {type:Number,default:1}
    }]
  }]
});

const Restaurant = module.exports = mongoose.model('Restaurant', RestaurantSchema);

module.exports.createRestaurant = (newRestaurant,cb)=>{
  newRestaurant.save(cb);
};

module.exports.getRestaurant = (cb)=>{
  Restaurant.findOne({}).exec(cb);
};

module.exports.getResturantById = (id,cb)=>{
  Restaurant.findOne({_id:id}).exec(cb);
};
