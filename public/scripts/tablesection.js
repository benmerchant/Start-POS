$(document).ready(function(){
  // when new section option selected from dropdown
  $('button#newSectSelect').on('click',()=>{
    $('div#new-section-div').show();
  });
  // if they click 'nevermind' hide new section input div
  $('button#goback-section').on('click',()=>{
    $('div#new-section-div').hide();
  });
  // if the 'create new section btn' is clicked
  $('button#new-section-btn').on('click',()=>{
    // make sure the input isn't empty
    const $newSectionName = $('input#newSection').val();
    if($newSectionName.length<1){
      $('div#new-section-div')
        .prepend('<div class="alert alert-danger">You didn\'t enter a name for the new section.</div>');
    }else{
      $.ajax({
        url: 'http://127.0.0.1:3000/restaurants/newsection',
        type: 'POST',
        data: {newSection:$newSectionName},
        beforeSend: ()=>{
          $('div#new-section-div').prepend('<h2 id="loader">LOADING ICON</h2>');
        }
      }).done((data)=>{
        console.log(data);
        $('div#new-section-div').hide();
      }).fail(()=>{
        $('div#new-section-div').prepend('<h2 id="loader">AJAX FAILURE</h2>');
      });
    }
  });
  // select a section, update it on screen
  $('button.section-name').on('click',function(){
    // get the name of the section
    const $sectionName = $(this).text();
    // display in DOM under Seat Input
    $('div#section-div').show();
    $('p#name-of-section').text($sectionName);
    $('button#new-table-btn').show();
  });
  // click the Create New Table button
  $('button#new-table-btn').on('click',function(){
    $('div.alert-danger').remove();
    const $tableName = $('input#tableName').val();
    const $seatCount = $('input#seatCount').val();
    const $sectionName = $('p#name-of-section').text();
    let goodToGo = false;
    if(!Number.isInteger(parseInt($seatCount))){
      $('h2#top').after('<div class="alert alert-danger">Must enter a number for the seat count</div>');
    }else{
      goodToGo = true;
    }
    if($tableName.length<1){
      $('h2#top').after('<div class="alert alert-danger">Must enter a name for the table</div>');
    }else{
      goodToGo = true;
    }
    const sendData = {tname:$tableName,count:$seatCount,sname:$sectionName};
    if(goodToGo){
      $.ajax({
        url: 'http://127.0.0.1:3000/restaurants/newtable',
        type: 'POST',
        data: sendData,
        beforesend: ()=>{
          $('div#psuedo-form').prepend('<h2 id="loader">LOADING ICON</h2>');
        }
      }).done((data)=>{
        console.log(data);
      }).fail(()=>{
        $('div#psuedo-form').prepend('<h2 id="loader">ERROR:newtab01AJAX FAILURE</h2>');
      });
    }



  });




















});
