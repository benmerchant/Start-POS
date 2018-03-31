$(document).ready(()=>{
    // enable/disable time input text boxes
  $('input.form-check-input').on('change',function(){
    const $checkBoxElem = this;
    if($checkBoxElem.checked){ // if the box is checked after  we click it
      // disable the corresponding input field
      // and change the text inside from a time to "off work"
      $(this).parent()
        .parent()
        .siblings('.input-cell')
        .children('div')
        .children('.form-control')
        .prop('disabled', false)
        .val('00:00')
        .attr('type','time');
    } else { // if the box is not checked
      $(this).parent()
        .parent()
        .siblings('.input-cell')
        .children('div')
        .children('.form-control')
        .prop('disabled', true)
        .attr('type','text')
        .val('off work');
    }
  });
  // ensure each end_time is AFTER each start_time
  // this works for checkboxes but not input text boxes??
  // $('input.end_input').on('focusout',()=>{
  //   const $thisInputName = this;
  //   console.log($thisInputName);
  // });




  // fill all boxes if OPEN AVAILABILITY checked
  $('input#avail-check').on('change',()=>{
    if(this.checked){ // if open Availability
      console.log('checked');
      // NOT WORKING

    } else {
      console.log('not checked');
    }
  });
});
