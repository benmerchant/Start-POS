const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const DailySalesReportSchema = new Schema({
  day_start:{type:Date,required:true},
  opener:{
    id:{type:ObjectId,required:true},
    name:{type:String,required:true}
  },
  day_end:{type:Date},
  closer:{
    id:{type:ObjectId},
    name:{type:String}
  },
  employees:[{
    id:{type:ObjectId},
    name:{type:String},
    role:{type:String},
    pay_rate:{type:Number},
    food_sales:{type:Number},
    bar_sales:{type:Number},
    other_sales:{type:Number},
    total_state_tax:{type:Number},
    total_local_tax:{type:Number}
  }]

});


const DailySalesReport = module.exports = mongoose.model('DailySalesReport',DailySalesReportSchema);

module.exports.startShift = (newReport,cb)=>{
  newReport.save(cb);
};

module.exports.findReportByDate = (date,cb)=>{

  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  let tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate()+1);


  DailySalesReport.find({
    day_start:{"$gte":date,"$lte":tomorrow}
  }).exec(cb);
};
