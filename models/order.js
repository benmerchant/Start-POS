const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// might seem redundant to store server id here
// and in parent doc "daily table", but eventually
// we will have functionality for more than one server
// to 'work' a Daily Table
// so we need to know who sent each order

const OrderSchema = mongoose.Schema({
  // date set when item inserted in DB
  // not when 'SEND' button clicked
  time_sent:{type:Date,default:Date.now},
  // when kitchen 'BUMPS' order
  time_bumped:{type:Date},
  sent_by:{type:ObjectId},
  items:[{
    id:{type:ObjectId},
    name:{type:String},
    price:{type:Number}
  }]
});

var Order = module.exports = mongoose.model('Order',OrderSchema);

module.exports.createOrder = (newOrderObj,cb) => {
  console.log(newOrderObj);
  newOrderObj.save(cb);
}

module.exports.getOrdersByIds = (ids,cb) => {

  Order.find(
    {_id:{$in:ids}},
    cb
  );
};
