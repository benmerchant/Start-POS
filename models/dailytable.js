const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const DailyTableSchema = mongoose.Schema({
  name: String,
  sales_report: ObjectId,
  server_id: ObjectId,
  server_name: String,
  section: String,
  table: String,
  Orders: [ObjectId],
  opened: {type:Date,default:Date.now},
  closed: Date,
  subtotal: {type:Number},
  state_tax: {type:Number},
  local_tax: {type:Number},
  payment_type: String

});

const DailyTable = module.exports = mongoose.model('DailyTable',DailyTableSchema);

module.exports.startNewTable = (newTable,cb) => {
  newTable.save(cb);
}

module.exports.getTableById = (id,cb)=>{
  DailyTable.findById(id,cb);
};

module.exports.getAllTablesForUser = (userId,cb)=>{
  DailyTable.find(
    {server_id:userId},
    cb
  );
};

module.exports.addOrder = (id,orderid,cb)=>{
  DailyTable.findByIdAndUpdate(
    id,
    {$push:{Orders:orderid}},
    {"safe":true,"new":true},
    cb
  );
};
