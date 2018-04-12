$(document).ready(function(){
  ///////////// load the orders
  // get the order ids
  const orderIds = $('span.order-ids').map(function(){
    return {_id:$(this).attr('data-order-id')};
  }).get();
  const ajaxString = {jsonData:JSON.stringify(orderIds)};
  // get these orders from the db
  $.ajax({
    contentType: "application/json",
    url: 'http://127.0.0.1:3000/api/getorders',
    type: 'GET',
    data: ajaxString
  }).done((data)=>{
    console.log('AJAX SUCCESS - order loader');
    console.log(data);
    $('div#order-loader').remove();
    const ordersArena = $('div#orders-arena');
    // foreach order
    data.forEach((order) => {
      // display the order
      ordersArena.prepend(`${order.time_sent}`);
      order.items.forEach((item) => {
        ordersArena.prepend(`${item.name}`);
      });
    });
  }).fail(()=>{
    console.log('AJAX FAILURE - order loader');
    $('div#order-loader').text('AJAX FAILURE - order loader');
  });




  // get table id
  const tableId = $('h2#top').attr('data-table-id');
  // get server id
  const serverId = $('p#server-id').attr('data-server-id');
  // When a server tries to leave the page make sure
  // the order was sent first.
  let orderSent = false;
  // get the item arena element
  const itemArena = $('div#item-arena');
  // declare an array for order list
  const newOrder = [];
  // when server clicks a menu heading button
  $('button.menu-heading').on('click',function () {
    // get the id of the menu heading
    const headingId = $(this).attr('id');
    // get the items
    const URL = `http://127.0.0.1:3000/api/items-in-section/${headingId}`;
    $.ajax({
      type: 'GET',
      url: URL,
      beforeSend: ()=>{
        itemArena.prepend('<h2 id="loader">LOADING ICON - items</h2>');
        $('div#item-div').remove();
      },
      complete: ()=>{
        $('h2#loader').remove();
      }
    }).done((data)=>{
      console.log('AJAX success - items');
      if(data.length===0){
        itemArena.prepend('<div id="item-div">No items in this menu</div>');
      }else{
        itemArena.prepend('<div id="item-div"></div>');
        data.forEach((item)=>{
          $('div#item-div').prepend(`<button id="${item._id}" data-price="${item.price}" class="btn btn-success item-btn">${item.name}</button>`);
        });
      }
    }).fail(()=>{
      itemArena.prepend('AJAX failure');
    });
  });
  // when a server clicks an item button
  // attach the handler to the parent div
  itemArena.on('click','button.item-btn',function(){
    // make the SEND btn green
    $('button#send').addClass('btn-success');
    const itemName = $(this).text();
    const itemPrice = $(this).attr('data-price');
    const itemId = $(this).attr('id');
    const itemObj = {
      _id: itemId,
      price: itemPrice,
      name: itemName
    };
    // reset order subtotal to 0 - inefficient, fix later
    let orderSubTotal = 0;

    newOrder.push(itemObj);
    // show current order in DOM
    // first clear the div
    $('div#currentOrder').empty();
    $('div#currentOrder').prepend('tap an item to remove from order<br>');
    newOrder.forEach((item,index)=>{
      // add each item to the DOM
      $('div#currentOrder').append(`<span class='item-span' data-index="${index}">${item.item_name} - ${item.item_price}</span><br>`);
      // add each item price to the subtotal for the order
      $('span.item-span').css('background-color','#c4cded');
      $('span.item-span').css('padding','5px');
      $('span.item-span').css('display','block');
      orderSubTotal += parseFloat(item.item_price);

    });
    $('div#currentOrder').prepend(`<h3>Order Subtotal: ${floatMoney(orderSubTotal)}</h3>`);

    // send to Orders collection

  });

  // remove order before sending it
  $('div#currentOrder').on('click','span.item-span',function(){
    // get the index of the current item from the DOM
    const thisItemIndex = $(this).attr('data-index');
    // reset order subtotal to 0 - inefficient, fix later
    let orderSubTotal = 0;
    newOrder.splice(thisItemIndex,1);
    $('div#currentOrder').empty();
    $('div#currentOrder').prepend('<span id="remove-msg">tap an item to remove from order</span><br>');
    newOrder.forEach((item,index)=>{
      // add each item to the DOM
      $('div#currentOrder').append(`<span class='item-span' data-index="${index}">${item.item_name} - ${item.item_price}</span><br>`);
      // add each item price to the subtotal for the order
      $('span.item-span').css('background-color','#c4cded');
      $('span.item-span').css('padding','5px');
      $('span.item-span').css('display','block');
      orderSubTotal += parseFloat(item.item_price);
    });
    $('div#currentOrder').prepend(`<h3>Order Subtotal: ${floatMoney(orderSubTotal)}</h3>`);
    if(newOrder.length===0){
      $('button#send').removeClass('btn-success');
      $('span#remove-msg').remove();
    }
  });
  $('button#send').on('click',function(){
    if($(this).hasClass('btn-success')){
      // create req object

      const outObject = {
        items: newOrder,
        serverId: serverId,
        dailyTableId: tableId
      };

      const dataForAjax = (JSON.stringify(outObject));
      //console.log(dataForAjax);

      $.ajax({
        type:'POST',
        url:'http://127.0.0.1:3000/api/neworder',
        data: dataForAjax,
        contentType: "application/json; charset=utf-8",
        beforeSend:() => {
            itemArena.append('<h2 id="order-sending">LOADING ICON - SENDING ORDER</h2>');
        }
      }).done((data)=>{
        console.log(data);
        window.location.href="/orders/alltables";
      }).fail(() => {
        console.log('AJAX FAILURE');
      });




    }else{
      // show message the send button isn't enabled
      // it is enabled when items added to order empty
      // might be better to see if the order array is empty
      $(this).after('<div class="alert alert-warning" id="no-item-msg">You haven\'t rang in items in to be sent.</div>');
      // fade message out quickly
      setTimeout(()=>{$('div#no-item-msg').fadeOut(1900);});
    }
  });
});

function floatMoney(price){
  return parseFloat(Math.round(price*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
}
