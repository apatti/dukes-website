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
	upcomingUmpireTask();
}

function upcomingMatch(){
	$.get("http://tennisballcricket.org/cricket_module/mobile_service.php?action=getTeamNextGame&tid=184",function(data,status){
			
	var ucMatch = $.parseJSON(data);
			
	var match = ucMatch[0].team1name + " vs " + ucMatch[0].team2name + " On " + ucMatch[0].match_date;	
	var ground = "At " + ucMatch[0].groundname +","+ucMatch[0].ground_address + " " +  ucMatch[0].ground_zip;
			var umpiresFrom = "Umpires From : "+ucMatch[0].umpireteam1name +" & " + ucMatch[0].umpireteam2name;
			
			$("#matchDiv").append(match);
			$("#groundAddressDiv").append(ground);
			$("#umpiresFromDiv").append(umpiresFrom);
		});
}

function upcomingUmpireTask(){
	$.get("http://tennisballcricket.org/cricket_module/mobile_service.php?action=getTeamUmpireGamesDetails&tid=184",function(data,status){
			
	var ucMatch = $.parseJSON(data);
			
	var match = ucMatch[0].team1name + " vs " + ucMatch[0].team2name + " On " + ucMatch[0].match_date;	
	var ground = "At " + ucMatch[0].groundname +","+ucMatch[0].ground_address + " " + groundcity + " "+  ucMatch[0].ground_zip;
			var umpiresFrom = "Umpires From : "+ucMatch[0].umpireteam1name +" & " + ucMatch[0].umpireteam2name;
			var upcomingMatchStr = '';	
				upcomingMatchStr = upcomingMatchStr + "<h5>"+ match +"</br>"+ ground +" </br>"+ umpiresFrom +"</h5>";
				
			$("#umpiringForDiv").append(match);
			$("#teamsForUmpringDiv").append(ground);
			$("#umpiringAddressDiv").append(umpiresFrom);
		});
}

function setHomePageCSS(){
	
}

