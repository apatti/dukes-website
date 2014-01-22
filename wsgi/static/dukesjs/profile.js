var DOMAIN_NAME = 'http://www.dukesxi.co';
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
			$('#fNameDiv').html("<h3>First Name : </h>"+userData['first_name']);
			$('#lNameDiv').html("<h3>Last Name : </h>"+userData['last_name']);
			$('#fbLinkDiv').html("<h3>FB Link : </h>"+userData['link']);
			Email : 
			$('#fbLinkDiv').html("<h3>Email : </h><input id='emailTxt' type='text' />");
			$('#fbProfileImg').html("<img src='https://graph.facebook.com/"+userData['username']+"/picture?type=normal' class='image' width='100px' height='100px'/>");
			updateTeamDropdown(userData.username);
		  } else if (response.status === 'not_authorized') {
			// the user is logged in to Facebook, 
			// but has not authenticated your app
			localStorage.removeItem('USER_FB_INFO');
		  } else {
			// the user isn't logged in to Facebook.
			localStorage.removeItem('USER_FB_INFO');
		  }
		 });
       };
	   
	   
	   applyCSSToPageComponents()
	
});
function updateTeamDropdown(username){
	var userAssociated = 'no';
	$.get(DOMAIN_NAME +'/users/'+username,function(data,status){
		var rr = JSON.stringify(data.user.results[0]);	
		alert(rr);
		alert(rr['last_name']);
	});
	
	/*
	$.ajax({
			  type: 'GET',
			  url: DOMAIN_NAME +'/users/'+username,
			  dataType: 'json',
			  success: function(res,status,jqXHR){
				jsonObj = JSON.stringify(res.result.results[0]);
				localStorage.setItem('USER_FB_INFO',jsonObj);
				alert("Success :"+status);
			  },
			  error: function(jqXHR, textStatus, errorThrown){
                    alert(textStatus, errorThrown);
                }
			 
			});
		 */
	$.get("http://www.tennisballcricket.org/cricket_module/mobile_service.php?action=getTeamPlayers&tid=184",function(data,status){
         var pData = $.parseJSON(data);
		 
         var dropdownList ="<table><tr><td><select id='basic' name='basic'><option value='0'>Select Player</option>";
          $.each(pData, function() {			 
              dropdownList = dropdownList + "<option value='"+this['pid']+"'>"+this['fname'] +" "+ this['lname']+"</option>";              
          });	
		  dropdownList = dropdownList + "</select></td><td><button id='associateBtn' type='button'>Associate</button></td></tr></table>";
	      $("#teamDropdown").html(dropdownList);         
    });
}
function applyCSSToPageComponents(){
	$('#default').puipanel();
	$('#basic').puidropdown({
			icon: 'ui-icon-check'
		});
	$('#associateBtn').puibutton();
	$('#emailTxt').puiinputtext(); 
}