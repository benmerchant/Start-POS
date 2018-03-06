var express = require('express');
var router = express.Router();

// GET the homepage
router.get('/', function(req, res){
  // res.send('html and stuff'); // test
  res.render('index');

})

// must have this or get an error
module.exports = router;
