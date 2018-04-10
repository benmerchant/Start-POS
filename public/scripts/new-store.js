$(document).ready(function(){
  let clickCount = 0;
  let name = '';
  let storeNum = '';
  let stateTax = '';
  let localTax = '';
  let tableCreated = false;
  $('input#name').focus();
  $('button#next').on('click',(event)=>{
    // remove any error alerts from the previous click
    $('div.alert').remove();
    event.preventDefault();
    switch (clickCount) {
      case 0:
        if($('input#name').val().length<1){
          $('input#name')
            .focus()
            .before("<div class=\"alert alert-danger\">You didn't enter a name for your new restaurant!</div>");
        }else{
          clickCount++;
          if(tableCreated) $('td#na').text($('input#name').val());
          $('div.one').show();
          $('input#storeNum').focus();
        }
        break;
      case 1:
        if($('input#storeNum').val().length<1){
          $('input#storeNum')
            .focus()
            .before("<div class=\"alert alert-danger\">You didn't enter a store number!</div>");
        }else{
          clickCount++;
          $('div.two').show();
          $('input#stateTax').focus();
        }
        break;
      case 2:
        if($('input#stateTax').val().length<1){
          $('input#stateTax')
            .focus()
            .before("<div class=\"alert alert-danger\">If your state doesn't have sales tax, enter: 0.</div>");
        }else{
          clickCount++;
          $('div.three').show();
          $('input#localTax').focus();
        }
        break;
      case 3:
        if($('input#localTax').val().length<1){
          $('input#localTax')
            .focus()
            .before("<div class=\"alert alert-danger\">If your state doesn't have sales tax, enter: 0.</div>");
        }else{
          clickCount++;
          $('div.zero').hide();
          $('div.one').hide();
          $('div.two').hide();
          $('div.three').hide();
          $('button#start_store').show();
          $('button#go_back').show();
          $('button#next').hide();
          name = $('input#name').val();
          storeNum = $('input#storeNum').val();
          stateTax = $('input#stateTax').val();
          localTax = $('input#localTax').val();
          let displayTable = '<table><tr>';
          displayTable += `<th>Restaurant Name</th><td id="na">${name}</td>`;
          displayTable += '</tr><tr>';
          displayTable += `<th>Store Num</th><td id="sn">${storeNum}</td>`;
          displayTable += '</tr><tr>';
          displayTable += `<th>State Sales Tax</th><td id="st">${stateTax}</td>`;
          displayTable += '</tr><tr>';
          displayTable += `<th>Local Sales Tax</th><td id="lo">${localTax}</td>`;
          displayTable += '</tr><tr>';
          displayTable += '</tr></table>';
          $('div#table-arena').html(displayTable);
          tableCreated = true;
        }
        break;
      default:
        alert('ERROR: RES0001 You should never be able to see this alert box!');
    }
  });
  // submit form button
  $('button#start_store').on('click',(event)=>{
    event.preventDefault(); // normal click functionality disabled
    if(clickCount<4){
      // if all inputs not filled out, click the 'next' button
      $('button#next').trigger('click');
    }else{
      // create request body
      const formData = $('form').serialize();
      const newStoreURL = "http://127.0.0.1:3000/restaurants";
      $.ajax({
        type: 'POST',
        url: newStoreURL,
        data: formData, // req.body
        beforeSend: function(){
          $('p#info').text('LOADING ICON:::Starting your new restaurant.');
          $('div#form-arena').children().hide();
        }
      }).done((data)=>{
        console.log(data);
        location.replace('/day0');
      }).fail(()=>{
        $('p#info').after('<h2>AJAX ERROR</h2>');
      }); // end ajax
    }
  });
  // go back button
  $('button#go_back').on('click',(event)=>{
    clickCount = 0;
    $('input#name').val(name);
    $('input#storeNum').val(storeNum);
    $('input#stateTax').val(stateTax);
    $('input#localTax').val(localTax);
    $('div.zero').show();
    $('button#start_store').hide();
    $('button#go_back').hide();
    $('button#next').show();
  });
});
