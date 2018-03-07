var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

router.get('/',(req,res)=>{
  // check to see if logged in, if not, redirect to login
  if(req.user){
    res.render('menus');
  } else {
    res.redirect('/employees/login');
  } // great job, ben. first try
});

router.get('/create-item',(req,res)=>{
  // COME BACK: check to see if logged in
  res.render('create-item-form');
});

router.post('/create-item',(req,res)=>{
  res.send('create item POST not ready');
});


module.exports = router;
