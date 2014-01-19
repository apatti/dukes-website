$(document).ready(function() {
 window.fbAsyncInit = function() {
	  FB.init({
		appId      : '627120887325860',
		status     : true, // check login status
		cookie     : true, // enable cookies to allow the server to access the session
		xfbml      : true  // parse XFBML
	  });
		 FB.getLoginStatus(function(response) {
		  if (response.status === 'connected') {
			
			var uid = response.authResponse.userID;
			var accessToken = response.authResponse.accessToken;
			
			var userData = $.parseJSON(localStorage.getItem('USER_FB_INFO'));
			$('#nameDiv').html("<h3>Name : </h>"+userData['name']);
			$('#locationDiv').html("<h3>Location : </h>"+userData['location']['name']);
			$('#fbProfileImg').html("<img src='https://graph.facebook.com/"+userData['username']+"/picture?type=normal'  class='image' width='100px' height='100px'/>");
			$('ul#mb1 li#profileTab').css('display','true');
		  } else if (response.status === 'not_authorized') {
			// the user is logged in to Facebook, 
			// but has not authenticated your app
			$('ul#mb1 li#profileTab').css('display','none');
			localStorage.removeItem('USER_FB_INFO');
		  } else {
			// the user isn't logged in to Facebook.
			$('ul#mb1 li#profileTab').css('display','none');
			localStorage.removeItem('USER_FB_INFO');
		  }
		 });
       };
$('#default').puipanel();
		$('#basic').puidropdown({
			icon: 'ui-icon-check'
		});
$('#associateBtn').puibutton();
		
	
});

