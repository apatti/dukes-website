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
var tca_id ='';
 $.get("http://tennisballcricket.org/cricket_module/mobile_service.php?action=getTeamLastMoM&tid=184",function(data,status){
    var pData = $.parseJSON(data);
    tca_id = pData.man_of_match;
	alert(tca_id);
	
	var playerOfTheWeek = '';
	
	//var username ="pram.gottiganti";
	playerOfTheWeek = playerOfTheWeek + "<table><tr>";
	playerOfTheWeek = playerOfTheWeek + "<td><img id='momImageId' src=''  class='image' width='100px' height='100px'/></td>";
	playerOfTheWeek = playerOfTheWeek + "<td>"+ pData.name +"</td>";
	playerOfTheWeek = playerOfTheWeek + "</tr></table>";
		
	$("#playerOfTheWeekDiv").append(playerOfTheWeek);
	
	
	});
	
	$.get("http://www.dukesxi.co/users/tca/"+7217,function(momData,status){
		var results = JSON.stringify(momData.user.results[0]);		
		var userData = $.parseJSON(results);
		
		jQuery("#momImageId").attr('src',"https://graph.facebook.com/"+userData['username']+"/picture?type=normal");
	});
	upcomingMatch();
}

function upcomingMatch(){
	$('#upcomingMatchDiv').append('Upcoming Match is on Sunday');
}

function setHomePageCSS(){
	
}

