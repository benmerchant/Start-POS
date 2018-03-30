$(document).ready(function(){
  $('.each-heading').on('click',function(){
    const $heading = $(this);
    const $heading_text = $(this).text();
    const $heading_id = $heading.attr('id');
    const $message_area = $heading.parent();
    const loadingIcon = "<h1>LOADING ICON...</h1>";
    $message_area.html(loadingIcon);
    // make sure the current heading has no items
    const URL = "http://127.0.0.1:3000/menus/items/api/"+$heading_id;

    $.getJSON(URL)
      .done(function(data){
        console.log('ajax request successful');
        if(data.length===0){
          const okayToDelete = "<h2>No items with this heading.<br>Okay to delete.</h2>"
          $message_area.html(okayToDelete);
          $message_area.append("<button class=\"btn btn-primary item-btn\" id="+$heading_id+">Delete "+$heading_text+"</button>");
        } else {

          const notOKtoDelete = "<h2>Some items have this menu heading. Delete items or reassign to delete</h2>";
          $message_area.html(notOKtoDelete+"Not implemented yet<hr>");
          $message_area.append("<table class=\"table table-bordered\">");
          $.each(data,function(i,item){
            $message_area.append("<tbody><tr>"+
            "<td class='menu-item'>"+item.name+"</td>"+
            "</tr>");
          });
          $message_area.append("</tbody></table>");
        }

      })
      .fail(function(){
        console.log('ajax request failed');
      });
  });
  // https://stackoverflow.com/questions/12065329/jquery-adding-event-listeners-to-dynamically-added-elements
  $('.heading-list').on('click','.menu-item',function(){
    alert('yay');
  }).on('click','button.item-btn',function(){
    //clicking on the dynamic button
    // we want to delete the menu heading
    const $heading_id = $(this).attr('id');
    const deletionURL = "http://127.0.0.1:3000/menus/items/headings/"+$heading_id;
    $.ajax({
      type: 'DELETE',
      url: deletionURL
    })
    .done(()=>{
      console.log('ajax deletion successful');
      // should this be done with Express?
      window.location.replace("http://127.0.0.1:3000/menus/manage");
    })
    .fail(function(){
      console.log('ajax request failed');
    });
  });

});
