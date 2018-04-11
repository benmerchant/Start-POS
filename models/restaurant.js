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
  dining_areas: [{name:String,tables:[]}]
});

const Restaurant = module.exports = mongoose.model('Restaurant', RestaurantSchema);

module.exports.createRestaurant = (newRestaurant,cb)=>{
  newRestaurant.save(cb);
};

module.exports.getRestaurant = (cb)=>{
  Restaurant.findOne({}).lean().exec(cb);
};

module.exports.getResturantById = (id,cb)=>{
  Restaurant.findOne({_id:id}).exec(cb);
};

module.exports.createSection = (store_id,newSectionName,cb)=>{
  const buildSection = {"name":newSectionName,"tables":[]};
  console.info(buildSection);
  Restaurant.findByIdAndUpdate(
    store_id,
    {$push: {dining_areas:buildSection}},
    {"safe":true, "upsert": true, "new":true},
    cb
  );
};

module.exports.addTable = (store_id,section,table,cb)=>{
  console.log(section);

  Restaurant.findOneAndUpdate(
    {'dining_areas.name': section},
    {$push:{'dining_areas.$.tables':table}},
    {"safe":true, "upsert": true, "new":true},
    cb
  );
};
// NOT ATOMIC!!!!
module.exports.toggleTableStatus = (section,oldSectionObject,newSectionObject,cb)=>{
  console.log('togggggle');
  // first remove the entire fucking section
  Restaurant.findOneAndUpdate(
    {},
    {$pull:{dining_areas:{name:section}}},
    {"safe":true,"new":true},
    function(){
      Restaurant.findOneAndUpdate(
        {},
        {$push:{dining_areas:newSectionObject}},
        {"safe":true,"new":true},
        cb
      );
    }
  );

};
