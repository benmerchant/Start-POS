var express = require('express');
var router = express.Router();

// GET the homepage
router.get('/',(req, res)=>{
  // res.send('html and stuff'); // test
  res.render('index');

})

router.get('/day0',(req,res)=>{
  res.render('index0');
});

// must have this or get an error
module.exports = router;
