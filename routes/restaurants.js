var express = require('express');
var router = express.Router();

const  { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

const Restaurant = require('../models/restaurant');

router.get('/',(req,res)=>{
  Restaurant.getRestaurant((err,doc)=>{
    if(err) throw error;
    if(doc) {
      console.log(doc);
      res.render('restaurant');
    }
    else {
      console.log('no restaurant yet');
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



module.exports = router;
