$(document).ready(()=>{
  // unassign a role from an employee
  $('button.unassign').click(function(){
    const $btnElem = $(this);
    const $roleID = $btnElem.attr('id');
    const $empID = $btnElem.closest('tbody').attr('id');

    // loading icon area
    $btnElem.closest('table').before('<h4 class="loading-icon">loading icon</h4>');


    const url = 'http://127.0.0.1:3000/employees/api/'+$empID+'/removerole/'+$roleID;
    $.ajax({
      method: 'PUT',
      url: url
    }).done((data)=>{
      // remove the 'loading icon'
      $('h4.loading-icon').remove();
      // response is simply a primitive string
      console.log('AJAX request: '+data);
      $btnElem.closest('tr').remove();
      // display a success message
    }).fail(()=>{
      $('h4.loading-icon').remove();
      console.log('ajax request failed');
    });
    // control boxes



  });
  // control which pay_rate input boxes are POSTed
  $('input.form-check-input').click(function(){
    const thisCheckbox = this;
    if(thisCheckbox.checked){
      // if checked, enable the input box for price
      $(this)
        .closest('div')
        .siblings('div.form-group')
        .children('input')
        .prop('disabled',false);
    } else {
      // if not checked, disable the input box
      $(this)
        .closest('div')
        .siblings('div.form-group')
        .children('input')
        .prop('disabled',true);
    }
  });
  // first time trying to PUT a form with jquery.AJAX
  // above i just grabbed elements from the DOM 'sloppy'
  // there doesn't appear to be a way to use express-validator with
  // dynamically generate input name attributes
  // Angular is the answer to that problem
  // its not much different, still get values from DOM elements
  // https://stackoverflow.com/questions/43922205/best-practices-form-processing-with-express
  // just ajax not full-page load from POST
  $('form#editRoleForm').submit(function(event){

    event.preventDefault();

    const $empID = $('a.empid').attr('id');
    console.log($empID);
    const $formData = $(this).serialize();
    console.log($formData);

    const url = 'http://127.0.0.1:3000/employees/api/'+$empID+'/editroles?'+$formData;

    $.ajax({
      url: url,
      method: 'PUT'
    }).done((data)=>{
      console.log(data);
    }).fail(()=>{
      console.log('ajax request failed');
    });


  });
});
