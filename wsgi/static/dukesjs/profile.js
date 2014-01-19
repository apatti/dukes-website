$(document).ready(function() {
 
		 FB.getLoginStatus(function(response) {
		  if (response.status === 'connected') {
			// the user is logged in and has authenticated your
			// app, and response.authResponse supplies
			// the user's ID, a valid access token, a signed
			// request, and the time the access token 
			// and signed request each expire
			var uid = response.authResponse.userID;
			var accessToken = response.authResponse.accessToken;
			alert(response);
			var userData = $.parseJSON(localStorage.getItem('USER_FB_INFO'));
			$('#nameDiv').html("<h3>Name : </h>"+userData['name']);
			$('#locationDiv').html("<h3>Location : </h>"+userData['location']['name']);
			$('#fbProfileImg').html("<img src='https://graph.facebook.com/"+userData['username']+"/picture?type=normal'  class='image' width='100px' height='100px'/>");
		  } else if (response.status === 'not_authorized') {
			// the user is logged in to Facebook, 
			// but has not authenticated your app
			alert("not_authorized");
			localStorage.removeItem('USER_FB_INFO');
		  } else {
			// the user isn't logged in to Facebook.
			alert("Not Login ");
			localStorage.removeItem('USER_FB_INFO');
		  }
		 });
       
$('#default').puipanel();
		$('#basic').puidropdown({
			icon: 'ui-icon-check'
		});
$('#associateBtn').puibutton();
		
	
});

