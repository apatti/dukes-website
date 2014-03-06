/**
 * Created by apatti on 3/6/14.
 */
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
       $('#adminTabPanel').hide();
       $('#noPermission').show();
	   $('#noPermission').append('Please Login To See Admin Dashboard');

	   location.reload();
		});
	FB.Event.subscribe('auth.login', function() {
		  location.reload();
	});
	 FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {
			loggedIn();
		}else{
            $('#adminTabPanel').hide();
            $('#noPermission').show();
			$('#noPermission').append('Please Login To See Admin Dashboard');
		}
	});

};
 function loggedIn(){
	 FB.api('/me', function(response) {
		  console.log('Good to see you, ' + response.name + '.');
		  localStorage.setItem('USER_FB_INFO',JSON.stringify(response));

		   fbUserName = response.username;
		   $('#loggedUserDiv').html(response.username);
		   if(fbUserName === 'pram.gottiganti' || fbUserName === 'ashwin.patti' || fbUserName === 'surendra.batchu'){
                selectTeam();
               $('#adminTabPanel').show();
               $('#noPermission').hide();
		   }else{
               $('#adminTabPanel').hide();
				$('#noPermission').show();
		   }
		});
 }


/*
 * Select Team
 */
function selectTeam()
{
    $.get("http://www.dukesxi.co/playingteam",function(data,status){
        var dd = $.parseJSON(data);
        $.each(dd['team'],function()
        {
            //TODO: Complete the functionality
        });

        $("#submitteam").click(function()
        {
            //TODO: Complete the functionality
            var playingTeam=$('input[name="playing"]:checkbox:checked').map(function(){
                return $(this).val();
            }).get();
            if(playingTeam.length!=7)
            {
                alert("Please select 7 players!!");
                return;
            }
            var playingteamobj={};
            playingteamobj.pollid=$("#selectpoll").children(":selected").attr("id");
            playingteamobj.team = playingTeam;

		    $.ajax({
			    type: "POST",
			    contentType:'application/json',
			    url: '/playingteam',
			    data: jsonObj,
			    dataType: 'json',
			    success: function(msg) {
			        alert("Team been submitted");
			        location.href="/";
		        }
		    });
        });
    });
}