$(document).ready(function(){
  $('button.reactivate').on('click',function(){
    const $btnClicked = $(this);
    // hide other cards
    $btnClicked.closest('div.card').siblings('div.card').hide();
    // make this card larger
    $btnClicked.closest('div.card').css('width','50rem');
    // hide this button
    $btnClicked.hide();
    $thisDiv = $btnClicked.closest('div');
    $thisDiv.append('<h3 class="confirm-msg">Are you sure you want to reactivate this employee?</h3>');
    $thisDiv.append('<button class="btn btn-success btn-lg yes">Yes</button>');
    $thisDiv.append('<button class="btn btn-danger btn-lg no">No</button>');


  });
  $('div.card-body').on('click','button.no',function(){
    // reform the DOM to original layout with all cards and this card resized
    $('button.reactivate').show().closest('div.card').css('width','20rem');
    $('button.yes').hide();
    $('button.no').hide();
    $('h3.confirm-msg').hide();
    $('div.card').show();
  }).on('click','button.yes',function(){
    alert('dasdf');
  });
});
