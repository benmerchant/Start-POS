$(document).ready(function(){
  $('.employee-2b-removed').click(function(){
    // alert($(this).attr('id'));
    const empID = $(this).attr('id');
    const empName = $(this).text();
    const replacementHTML = "<div class='alert alert-danger'>Are you sure you want to deactivate: "+empName+"</div>"
    +"<form method='POST' action='/employees/deactivate/"+empID+"'>"
    +"<button type='submit' class='btn btn-primary'>Yes Deactivate</button></form>" +
    "<a href='/employees/deactivate'><button class='btn btn-danger'>No. Go back</button></a>";
    $(this).parent().replaceWith(replacementHTML);
  });











});
