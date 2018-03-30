var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

const Menu = require('../models/menu');
const Item = require('../models/item');

var ObjectId = require('mongoose').Types.ObjectId;

router.get('/',(req,res)=>{
  // check to see if logged in, if not, redirect to login
  if(req.user){
    res.render('menus');
  } else {
    res.redirect('/employees/login');
  } // great job, ben. first try
});

router.get('/manage',(req,res)=>{
  const allHeadingsQuery = Menu.find({});
  allHeadingsQuery.exec((err,docs)=>{
    if(err) throw err;
    res.render('menu-management',{
      menus: docs
    });
  });
});

router.post('/create-heading',[
  check('menu_heading').isLength({min:1}).withMessage('You didn\'t enter a name for the new heading')
],(req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const allHeadingsQuery = Menu.find({});
    allHeadingsQuery.exec((err,docs)=>{
      res.render('menu-management',{
        errors: errors.array(),
        menus: docs
    });

    });
  } else {
    const checkData = matchedData(req);
    // make sure that heading doesn't already exist before going any further
    const headingQuery = Menu.findOne({menu_heading: checkData.menu_heading});
    headingQuery.exec((err,menu)=>{
      if (err) throw err;
      if(menu){
        // if there is a document with the same menu_heading
        const allHeadingsQuery = Menu.find({});
        allHeadingsQuery.exec((err,docs)=>{
          res.render('menu-management',{
            errors: [{ msg: 'That menu heading name already exists' }],
            menus: docs
          });
        });
      } else {
        // if there is no heading by that name already in the collection
        const newMenu = new Menu({
          menu_heading: checkData.menu_heading
        });

        // store new menuheading in the db
        Menu.createMenuHeading(newMenu,(err,menu)=>{
          if(err) throw err;
        });
        req.flash('success_msg', 'Successfully added a new Menu Heading');
        res.redirect('/menus/manage');
      }
    });
  }
});

router.get('/create-item',(req,res)=>{
  // COME BACK: check to see if logged in
  Menu.getAllHeadings({},(err,headings)=>{
    if(err) throw err;
    // console.log(headings);
    res.render('create-item-form',{
      headings: headings
    });
  });

});

router.get('/items',(req,res)=>{
  Item.getAllItems({},(err,allItems)=>{
    if(err) throw err;
    // need separate by heading before sending to view ?
    res.render('items-view-all',{
      items: allItems
    });
  });
});

router.get('/items/:id',(req,res)=>{
  Item.getItemById(req.params.id,(err,doc)=>{
    if(err) throw err;
    console.log(doc);
    res.render('item-detail',{
      item: doc
    });
  });
});

// oh god this is bad routing
// how will my app know if this is for a heading or item?
router.get('/items/api/:heading_id',(req,res)=>{
  Item.getItemsByHeadingId({
    "menu._id": ObjectId(req.params.heading_id)
  },(err,items)=>{
    if(err) throw err;
    res.json(items);
  });
});

router.delete('/items/headings/:id',(req,res)=>{
  Menu.deleteHeading({
    _id: req.params.id
  },(err,heading)=>{
    if(err) throw err;
    // change the HTTP method
    //req.method = 'GET';
    // res.redirect(303,'/menus');
    // res.json({message: 'Heading deleted'});
  });
});


router.post('/create-item',[
  check('name').isLength({min:1}).withMessage('Must enter a name for the item'),
  check('price').isDecimal().withMessage('Must enter a number for the price'),
  check('description').isLength({min:0}).withMessage('It would be difficult to ever see this error'),
  check('menu_heading').exists().withMessage('No menu heading THIS SHOULD NEVER APPEAR. If so, contact DB admin')
],(req,res,next)=>{
  console.log(req.body);
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    Menu.getAllHeadings({},(err,headings)=>{
      if(err) throw err;
      res.render('create-item-form',{
        errors: errors.array(),
        headings: headings
      });
    });
  } else {
    const checkData = matchedData(req);
    const headingArray = checkData.menu_heading.split(" - ");
    const menuHeadingName = headingArray[0];
    const menuHeadingID = headingArray[1];
    var newItem = new Item({
      name: checkData.name,
      price: checkData.price,
      menu: {
        _id: menuHeadingID,
        menu_heading: menuHeadingName
      }
    });

    Item.createItem(newItem,(err,item)=>{
      if(err) throw err;

      req.flash('success_msg', 'Item successfully added to the menu.');
      res.redirect('/menus/items');
    });
  }
});


module.exports = router;
