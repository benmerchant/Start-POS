// messy as hell had to include jQuery again in the view
// as this will render the script before the jQuery call
$(document).ready(function(){
//   $('input#first_name_check').click(function(){
//     if(this.checked){
//       $('input#first_name_input').prop('disabled', false);
//     } else { // prop is in new jQuery. leaving attr for now
//       $('input#first_name_input').attr("disabled", true);
//     }
//   });

  // need this in case the page is reloaded
  // if($('input.form-check-input').checked){
  //   $(this).parent().siblings('.input-cell').children('.form-control').prop('disabled', false);
  // }


  // let's try this programatically got IT

  $('input.form-check-input').click(function(){
    if(this.checked){ // if the box is checked after  we click it
      // disable the corresponding input field
      $(this).parent().siblings('.input-cell').children('.form-control').prop('disabled', false);
    } else {
      $(this).parent().siblings('.input-cell').children('.form-control').prop('disabled', true);
    }
    // just wasted 35 minutes because i was using strings instead of booleans
  });



});
