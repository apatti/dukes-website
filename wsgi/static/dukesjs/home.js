var fbUserName='';
var DOMAIN_NAME = 'http://www.dukesxi.co';
window.fbAsyncInit = function() {
  FB.init({
    appId      : '627120887325860',
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });
	 FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {
		loggedIn();
		}
	});
};
		  
  function loggedIn() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Good to see you, ' + response.name + '.');	  
      localStorage.setItem('USER_FB_INFO',JSON.stringify(response));
	
	   fbUserName = response.username;	  
		payerOfTheWeek(response.username);
	});
    
  }
 
function payerOfTheWeek(fbUser){

 $.get("http://tennisballcricket.org/cricket_module/mobile_service.php?action=getTeamLastMoM&tid=184",function(data,status){
    var pData = $.parseJSON(data);
    var tca_id = pData.man_of_match;
	alert(tca_id);
	tca_id = 7217;
	var playerOfTheWeek = '';
	var mom ='';
	$.get("http://www.dukesxi.co/users/tca/"+tca_id,function(data,status){
		var results = JSON.stringify(data.user.results[0]);		
		var userData = $.parseJSON(results);
		
		mom =  userData['username'];		
	});
	//var username ="pram.gottiganti";
	playerOfTheWeek = playerOfTheWeek + "<table><tr>";
	playerOfTheWeek = playerOfTheWeek + "<td><img src='https://graph.facebook.com/"+mom+"/picture?type=normal'  class='image' width='100px' height='100px'/></td>";
	playerOfTheWeek = playerOfTheWeek + "<td>"+ pData.name +"</td>";
	playerOfTheWeek = playerOfTheWeek + "</tr></table>";
		
	$("#playerOfTheWeekDiv").append(playerOfTheWeek);
	upcomingMatch();
	});
}

function upcomingMatch(){
	$('#upcomingMatchDiv').append('Upcoming Match is on Sunday');
}

function setHomePageCSS(){
	
}

