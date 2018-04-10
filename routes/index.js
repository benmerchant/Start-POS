var express = require('express');
var router = express.Router();

var DailySalesReport = require('../models/dailysalesReport');
// GET the homepage
router.get('/',(req, res)=>{
  // res.send('html and stuff'); // test
  const today = new Date();
  //console.log(today);
  DailySalesReport.findReportByDate(today,(err,doc)=>{
    if(err) throw error;
    // if there is no doc, the DOM will display OPEN button
    res.render('index',{
      report: doc
    });
  });

});

router.get('/dashboard',(req,res)=>{
  res.render('managerdashboard');
});

router.get('/day0',(req,res)=>{
  res.render('index0');
});

// open for business
router.post('/open',(req,res)=>{
  // initialize a daily sales report
  const NewDailySalesReport = new DailySalesReport({
    day_start: new Date(),
    opener:{
      id:req.user.id,
      name: `${req.user.first_name} ${req.user.last_name}`
    }
  });
  console.log(NewDailySalesReport);
  DailySalesReport.startShift(NewDailySalesReport,(err,docs)=>{
    res.send('AJAX SUCCESS: store opened');
  });
});

// must have this or get an error
module.exports = router;
