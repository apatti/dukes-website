
$(document).bind('login_complete', loggedIn);
	   
function loggedIn(){
    var userData = $.parseJSON(localStorage.getItem('USER_GOOGLE_INFO'));
    $('#nameDiv').html("<h3>Name : </h>"+userData.name);
			$('#fNameDiv').html("<h3>First Name : </h>"+userData.first_name);
			$('#lNameDiv').html("<h3>Last Name : </h>"+userData.last_name);
			Email :
			$('#emailTxtDiv').html("<h3>Email : </h><input id='emailTxt' type='text' value="+userData.email+">");
			$('#profileImg').html("<img src="+userData.imagelink+" class='image' width='100px' height='100px'/>");
            $('#centerContent').val("");
            applyCSSToPageComponents();
}   

function applyCSSToPageComponents(){
	$('#default').puipanel();
	$('#dukesTeamSelect').puidropdown();
	$('#associateBtn').puibutton();
	$('#emailTxt').puiinputtext(); 
}