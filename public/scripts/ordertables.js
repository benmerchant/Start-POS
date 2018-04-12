$(document).ready(function(){
  // when an open table is selected
  $('button.open-table').on('click',function(){
    // remove loading icon if it exists
    $('div#loader').remove();

    const section = $(this).closest('div').attr('id');
    const table = $(this).text();
    const bodyData = {section:section,table:table,changeto:false}

    // the api changes stats in main restaurant doc
    // and creates a new TABLE doc
    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1:3000/orders/api/toggletable',
      data: bodyData,
      beforeSend: ()=>{
        $('h2#top').after('<div id="loader">LOADING ICON</div>');
      }
    }).done((data)=>{
      console.log('AJAX SUCCESS');
      console.log(data);
      $('div#loader').remove();
      // reload the entire page
      window.location.href = `/orders/mytable/${data}`;
    }).fail(()=>{
      $('h2#top').after('failure');
      $('div#loader').remove();
    });
  });
});
