var express = require('express');
var router = express.Router();

const  { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

const Restaurant = require('../models/restaurant');

router.get('/',(req,res)=>{
  Restaurant.getRestaurant((err,doc)=>{
    if(err) throw error;
    if(doc) {
      // normal restaurant page
      res.render('restaurant');
    }
    else {
      // initialize restaurant ONCE
      res.render('create-restaurant');
    }
  });

});

router.post('/',(req,res)=>{
  const NewRestaurant = new Restaurant({
    store_number: req.body.storeNum,
    name: req.body.name,
    state_tax: req.body.stateTax,
    local_tax: req.body.localTax
  });
  Restaurant.createRestaurant(NewRestaurant,(err)=>{
    res.send('AJAX SUCCESSfully created your store!');
  });
});

router.get('/tables',(req,res)=>{
  Restaurant.getRestaurant((err,doc)=>{
    if(err) console.error(err);
    const sections = doc.dining_areas;
    // console.log(sections);
    res.render('storedetails/tables',{
      sections: sections
    });
  });
});

router.post('/newsection',(req,res)=>{
  // there should only ever be one restaurant in the DB
  // yes we have to search this collection each time a new section is added
  // this doesn't happen very often, better to use processing power
  // than disk space/memory by storing it other places
  const newSection = req.body.newSection;
  Restaurant.getRestaurant((err,doc)=>{
    if(err) throw error;
    const store_id = doc._id;
    console.log(doc);
    Restaurant.createSection(store_id,newSection,(err,doc)=>{
      if(err) console.log(err);
      console.log(doc);
      res.send('AJAX SUCCESS');
    });
  });
});

router.post('/newtable',(req,res)=>{
  const newTable = req.body.tname;
  const newCount = req.body.count;
  const section = req.body.sname;
  const newTableObj = {name:newTable,seatCount:newCount,open:true};

  Restaurant.getRestaurant((err,doc)=>{
    if(err) console.error(err);
    // let areas = doc.dining_areas;
    doc.dining_areas.forEach((area)=>{
      if(area.name===section){

        Restaurant.addTable(doc.id,section,newTableObj,(err,doc)=>{
          if(err) console.error(err);
          console.log(doc);
          res.send('AJAX SUCCESS');
        });
      }
    });

  });
});


module.exports = router;
