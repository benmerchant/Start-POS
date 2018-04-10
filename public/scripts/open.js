$(document).ready(function(){
  // this script only loads if a user is logged in
  const d = new Date();
  const options = {weekday:'long',year:'numeric',month:'long',day:'numeric',hour:'numeric',minute:"numeric"};
  $('p#date').text(d.toLocaleDateString('en-US',options));

  $('button#open').on('click',()=>{
    $('div#loader').remove();
    $('div.alert').remove();
    const openStoreURL = 'http://127.0.0.1:3000/open';
    $.ajax({
      type: 'POST',
      url: openStoreURL,
      beforeSend: ()=>{
        $('p#date').after('<div id="loader">LOADING ICON: opening store for the day</div>');
      }
    }).done((data)=>{
      console.log(data);
      $('div#loader').remove();
      $('p#date').after('<div class="alert alert-success">Store is now open for business</div>');
      $('button#close').show();
      $('button#open').hide();
    }).fail(()=>{
      $('div#loader').remove();
      $('p#date').after('<div class="alert alert-danger">AJAX FAILURE: unable to open store</div>');
    });
  });
});
