
$(document).bind('login_complete', loggedIn);
	   
function loggedIn(){
    alert("Profile.js");
    var userData = $.parseJSON(localStorage.getItem('USER_GOOGLE_INFO'));
    $('#nameDiv').html("<h3>Name : </h>"+userData.displayName);
			$('#fNameDiv').html("<h3>First Name : </h>"+userData.name.givenName);
			$('#lNameDiv').html("<h3>Last Name : </h>"+userData.name.familyName);
			Email :
			$('#emailTxtDiv').html("<h3>Email : </h><input id='emailTxt' type='text' value="+userData.emails[0].value+">");
			$('#profileImg').html("<img src="+userData.image.url+" class='image' width='100px' height='100px'/>");
            applyCSSToPageComponents();
}   

function applyCSSToPageComponents(){
	$('#default').puipanel();
	$('#dukesTeamSelect').puidropdown();
	$('#associateBtn').puibutton();
	$('#emailTxt').puiinputtext(); 
}