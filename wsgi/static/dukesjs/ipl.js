var fbUserName='';
var DOMAIN_NAME = 'http://www.dukesxi.co';
window.fbAsyncInit = function() {
  FB.init({
    appId      : '627120887325860',
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });
   FB.Event.subscribe('auth.logout', function(response) {
	   logout();
	   location.reload();
		});
	FB.Event.subscribe('auth.login', function() {
		  location.reload();
	});
	 FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {		
			loggedIn();					
		}else{
			//$('#pollsDiv').append('Please Login To See Poll');
		}
	});
	
};
 function loggedIn(){
	 FB.api('/me', function(response) {
		  console.log('Good to see you, ' + response.name + '.');	  
		  localStorage.setItem('USER_FB_INFO',JSON.stringify(response));
		
		   fbUserName = response.username;
		   $('#loggedUserDiv').html(response.username);	 
		   ipl_init();
		});
 }
 
 
	function ipl_init(){
        $.get(DOMAIN_NAME+"/users/"+fbUserName,function(data,status){
            var results = JSON.stringify(data.user.results[0]);
            var userData = $.parseJSON(results);
            var email = userData.email;
            alert(email);
            if(email != ''){
                alert(email);
                $('#emailTxt').text(email);
                $('#emailTxt').attr('readonly');
            }
        });
	}

$('#teamNameSubmitBtn').click(function (){
    var iplTeamObj = {};
    iplTeamObj.iplteam = $('#iplTeamNameTxt').val();
    iplTeamObj.email = $('#emailTxt').val();

    alert(JSON.stringify(iplTeamObj))
});
	
 