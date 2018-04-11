const express = require('express');
const router = express.Router();

const DailySalesReport = require('../models/dailysalesReport');
const Restaurant = require('../models/restaurant');
const DailyTable = require('../models/dailytable');

router.get('/',(req,res)=>{
  DailySalesReport.findReportByDate(new Date(),(err,report)=>{
    if(err) console.error(err);
    console.log(report);
    res.render('ordermode/home',{
      report:report
    });
  });
});
// show all tables, both open and closed
// only open tables can be created into a new table
router.get('/alltables',(req,res)=>{
  Restaurant.getRestaurant((err,store)=>{
    if(err) console.error(err);
    //console.log(store.dining_areas);
    res.render('ordermode/alltables',{
      sections: store.dining_areas
    });
  });
});

router.post('/api/toggletable/',(req,res)=>{
  const section = req.body.section;
  const table = req.body.table;
  const bool = (req.body.changeto == 'true');
  // const bool = true; // dev purposes
  console.log(`${section} AND ${table} set ${bool}`);
  // mongoDB fixed the issue with updated nested arrays,
  // however, i don't believe mongoose has done so yet
  // just hack it in, get object, change, save back to db
  Restaurant.getRestaurant((err,store)=>{
    if(err) console.error(err);
    // iterate through all dining areas
    store.dining_areas.forEach((area,aIndex)=>{
      if(area.name===section){
        // iterate through all tables in dining area
        area.tables.forEach((tab,sIndex)=>{
          if(tab.name===table){
            // console.log(sIndex);
            // clone the old section object
            let oldSection = JSON.parse(JSON.stringify(area));
            let thisSection = area;
            // copy this table
            let thisTable = tab;
            thisSection.tables[sIndex].open = bool;
            //console.log(thisSection.tables[aIndex]);
            // change the open status to false
            // console.log(oldSection);
            // console.log(thisSection);

            // uncomment after testing daily table model
            Restaurant.toggleTableStatus(section,oldSection,thisSection,(err,doc)=>{
              if(err) console.error(err);
              // now the table is marked as sat in the main restaurant document
              // now we need to start a new 'table'
              const currentUser = res.locals.user;


              const newDailyTable = new DailyTable({
                server_id: currentUser._id,
                server_name:currentUser.display_name,
                section: section,
                table: table
              });

              DailyTable.startNewTable(newDailyTable,(err,doc) => {
                if(err) console.error(err);

                res.send(doc._id);
              });
            });
          }
        });
      }
    });
  });
});

router.get('/newtable/:id',(req,res) => {
  DailyTable.getTableById(req.params.id,(err,doc) => {
    if(err) console.error(err);
    res.render('ordermode/newtable',{
      table:doc
    });
  });
});

module.exports = router;
