var express = require('express');
var router = express.Router();

const DailyTable = require('../models/dailytable');
const Item = require('../models/item');
const Order = require('../models/order');
const ObjectId = require('mongoose').Types.ObjectId;

///////////////////////////////////////
// DOCUMENTATION
// params: req.params.sectionid - the section you want items from
//          ObjectId
// return: json object contain items
router.get('/items-in-section/:sectionid',(req,res)=>{
  // convert id requested to correct type
  const sectionId = ObjectId(req.params.sectionid);
  // build the query object
  const query = {'menu._id':sectionId};
  Item.getItemsByHeadingId(query,(err,items)=>{
    if(err) console.error(err);
    console.log(items)
    res.json(items);
  });
});

router.post('/neworder',(req,res)=>{

  const serverId = ObjectId(req.body.serverId);
  const dailyTableId = ObjectId(req.body.dailyTableId);
  const items = req.body.items;
  console.log(items);
  const newOrder = new Order({
    sent_by:serverId,
    items:items
  });
  console.log('NEW ORDER_______________');
  console.log(newOrder);


  Order.createOrder(newOrder,(err,order) => {
    if(err) console.error(err);
    console.log(order);
    // after the order is created, add its ID to its parent Daily Table
    DailyTable.addOrder(dailyTableId,order._id,(err,table) => {
      if(err) console.error(err);

      console.log(table);
      res.json({msg:'AJAX SUCCESS: from express'});
    });
  });
});

router.get('/getorders',(req,res)=>{
  // parse incoming data
  const queries = JSON.parse(req.query.jsonData);
  // empty array to hold the ids
  let ids = [];
  // turn each id into an ObjectId
  // and push it to the ids array
  queries.forEach((object)=>{
    ids.push(ObjectId(object._id));
  });
  Order.getOrdersByIds(ids,(err,orders) => {
    if(err) console.error(err);
    // send the orders back to the client
    res.json(orders);
  });
});





module.exports = router;
