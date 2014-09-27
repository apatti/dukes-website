 window.fbAsyncInit = function() {
	  FB.init({
		appId      : '627120887325860',
		status     : true, // check login status
		cookie     : true, // enable cookies to allow the server to access the session
		xfbml      : true  // parse XFBML
	  });
	  FB.Event.subscribe('auth.logout', function(response) {
	   logout();
	   $('#loggedUserDiv').html("");
		});
		FB.Event.subscribe('auth.login', function() {
		  location.reload();
		});
		
		 FB.getLoginStatus(function(response) {
		  if (response.status === 'connected') {
			loggedIn();
			var uid = response.authResponse.userID;			
			var accessToken = response.authResponse.accessToken;
			
			
		  } else if (response.status === 'not_authorized') {
			// the user is logged in to Facebook, 
			// but has not authenticated your app
			localStorage.removeItem('USER_FB_INFO');
		  } else {
			// the user isn't logged in to Facebook.
			localStorage.removeItem('USER_FB_INFO');
		  }
		 });
		 applyCSSToPageComponents();
 };

$(document).bind('login_complete', loggedIn);
	   
function loggedIn(){
    var userData = $.parseJSON(localStorage.getItem('USER_GOOGLE_INFO'));
    $('#nameDiv').html("<h3>Name : </h>"+userData.displayName);
			$('#fNameDiv').html("<h3>First Name : </h>"+userData.name.givenName);
			$('#lNameDiv').html("<h3>Last Name : </h>"+userData.name.familyName);
			$('#profileLinkDiv').html("<h3>Google+ Link : </h>"+userData.url);
			Email :
			$('#emailTxtDiv').html("<h3>Email : </h><input id='emailTxt' type='text' value="+userData.emails[0].value+">");
			$('#profileImg').html("<img src="+userData.image.url+" class='image' width='100px' height='100px'/>");

			updateTeamDropdown(response.username);
}   

function updateTeamDropdown(username){
	var userAssociated = 'no';
	$.get(DOMAIN_NAME +'/users/'+username,function(data,status){
		var results = JSON.stringify(data.user.results[0]);	
		
		var userData = $.parseJSON(results);
		/*
		if(userData['last_name']){
				alert(userData['last_name']);
		}else{
			alert('test');
		}
		*/
		if(userData['tca_associated'] === 1 ){
				//alert(userData['tca_id']);
				$('#emailTxt').val(userData['email']);
		}else{
			// User is not yet associated with TCA user
			$.get("http://www.tennisballcricket.org/cricket_module/mobile_service.php?action=getTeamPlayers&tid=184",function(data,status){
				 var pData = $.parseJSON(data);
				 
				 var dropdownList ="<table><tr><td><select id='dukesTeamSelect' name='dukesTeamSelect'><option value='0'>Select Player</option>";
				  $.each(pData, function() {			 
					  dropdownList = dropdownList + "<option value='"+this['pid']+"'>"+this['fname'] +" "+ this['lname']+"</option>";              
				  });	
				  dropdownList = dropdownList + "</select></td><td><button id='associateBtn' type='button'>Associate</button></td></tr></table>";
				  $("#teamDropdown").html(dropdownList);  
				  //assign Event listener
					$('#associateBtn').click( function(){
						var tca_id = $("#dukesTeamSelect").val();
						var email = $('#emailTxt').val();
						//alert(tca_id);
						//alert(email);
						$.ajax(
						       {
							type: "PUT",
							contentType:'application/json',
							url: DOMAIN_NAME +'/users/'+username+'?associate=1',
							data: JSON.stringify({'tca_id':tca_id,'email':email} ),
							dataType: 'json',
							success: function(msg) 
							       {
								   alert("Thank you for association, we would process it and confirm you through the email address provided");
								   location.href="/";
							       }
						});
					});
			});
		}
		
	});
	
	
}
function applyCSSToPageComponents(){
	$('#default').puipanel();
	$('#dukesTeamSelect').puidropdown();
	$('#associateBtn').puibutton();
	$('#emailTxt').puiinputtext(); 
}