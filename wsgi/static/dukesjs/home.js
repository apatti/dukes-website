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
		var tca_id ='';
		var mom='';
		var pData = $.parseJSON(data);
		tca_id = pData.man_of_match;
		mom = pData.name;
		updatePlayerOfTheWeekDiv(tca_id,mom);
	});
	
	updatePlayerOfTheWeekDiv = function(tca_id , mom ){
		$.get("http://www.dukesxi.co/users/tca/"+tca_id,function(momData,status){
			var results = JSON.stringify(momData.user.results[0]);		
			var userData = $.parseJSON(results);
			
			var playerOfTheWeek = '';
			
			//var username ="pram.gottiganti";
			playerOfTheWeek = playerOfTheWeek + "<table><tr>";
			playerOfTheWeek = playerOfTheWeek + "<td><img  src='https://graph.facebook.com/"+userData['username']+"/picture?type=normal'  class='image' width='75px' height='75px'/></td>";
			playerOfTheWeek = playerOfTheWeek + "<td><h3>"+ mom +"</h3></td>";
			playerOfTheWeek = playerOfTheWeek + "</tr></table>";
			
			$("#playerOfTheWeekDiv").append(playerOfTheWeek);
			
		});
	};
	upcomingMatch();
}

function upcomingMatch(){
	$.get("http://tennisballcricket.org/cricket_module/mobile_service.php?action=getTeamNextGame&tid=184",function(data,status){
			var results = JSON.stringify(data);
alert(results.team2name);			
			var upComingMatchFromTCA = $.parseJSON(results);
			alert(upComingMatchFromTCA.umpireteam1name);
			alert(upComingMatchFromTCA);
			var upcomingMatchDiv = '';
			
			
			$('#upcomingMatchDiv').append(upcomingMatchDiv);
			
		});
}

function setHomePageCSS(){
	
}

