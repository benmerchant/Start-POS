$(document).ready(function(){
  $('button.reactivate').on('click',function(){
    const $btnClicked = $(this);
    const $empID = $(this).attr('id');
    // hide other cards
    $btnClicked.closest('div.card').siblings('div.card').hide();
    // make this card larger
    $btnClicked.closest('div.card').css('width','50rem');
    // hide this button
    $btnClicked.hide();
    $thisDiv = $btnClicked.closest('div');
    $thisDiv.append('<h3 class="confirm-msg">Are you sure you want to reactivate this employee?</h3>');
    $thisDiv.append('<button id="'+$empID+'" class="btn btn-success btn-lg yes">Yes</button>');
    $thisDiv.append('<button class="btn btn-danger btn-lg no">No</button>');
    // hide success message if exists
    $('div#success').remove();


  });
  $('div.card-body').on('click','button.no',function(){
    // reform the DOM to original layout with all cards and this card resized
    $('button.reactivate').show().closest('div.card').css('width','20rem');
    $('button.yes').hide();
    $('button.no').hide();
    $('h3.confirm-msg').hide();
    $('div.card').show();
  }).on('click','button.yes',function(){
    // need to remove the employee from the archived collection
    // and add back to the regular employee collection
    const $loginNumber = $(this).attr('id');
    const reactivateURL = "http://127.0.0.1:3000/employees/api/reactivate/"+ $loginNumber;
    $.ajax({
      type:'PUT',
      url: reactivateURL,
      beforeSend: function(){
        $('div#loadingIcon').show();
      },
      complete: function(){
        // hide loading icon regardless of success or failure
        $('div#loadingIcon').hide();
      }
    }).done((data)=>{
      console.log(data);
      $('button.yes').hide();
      $('button.no').hide();
      $(this).closest('div.card').siblings('div.card').show();
      $(this).closest('div.card').remove();
      $('h2#top-banner').after('<div id="success" class="alert alert-success">Employee Successfully Reactivated</div>');

    }).fail(()=>{

      $('h2#top-banner').after('<p>AJAX error</p>');
    });

  });
});
