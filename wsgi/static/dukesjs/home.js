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
	   $('#loggedUserDiv').html(response.username);	   
		//payerOfTheWeek(response.username);
           //Post FB data to dukes service                                                                                                                                                                         
           var jsonObj ='';
           var dataTobesent ={ 'name':response.name,'first_name': response.first_name,'last_name':response.last_name, 'username':response.username,'fb_id':response.id,'link':response.link} ;
           //alert(JSON.stringify(dataTobesent));                                                                                                                                                                  
           $.ajax({
		   type: 'POST',
		       url: DOMAIN_NAME +'/users/',
		       dataType: 'json',
		       contentType:'application/json',
		       data:JSON.stringify(dataTobesent),
		       success: function(res,status,jqXHR){
		       jsonObj = JSON.stringify(res.result.results[0]);
		       localStorage.setItem('USER_FB_INFO',jsonObj);
		   },
		       error: function(jqXHR, textStatus, errorThrown){
		       alert(textStatus, errorThrown);
		   }

	       });

	});
    
  }
 
$(document).ready(function(){

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
				playerOfTheWeek = playerOfTheWeek + "<td><h3><a href=/player.html?pid="+tca_id+">"+ mom +"</a></h3></td>";
				playerOfTheWeek = playerOfTheWeek + "</tr></table>";
				
				
				$("#playerOfTheWeekDiv").append(playerOfTheWeek);
				
			});
		};
		upcomingMatch();
		upcomingUmpireTask();
	});

	function upcomingMatch(){
		$.get("http://tennisballcricket.org/cricket_module/mobile_service.php?action=getTeamNextGame&tid=184",function(data,status){
				
		var ucMatch = $.parseJSON(data);
				
		var match = ucMatch[0].team1name + " vs " + ucMatch[0].team2name + " On " + ucMatch[0].match_date;	
		var ground = "At " + ucMatch[0].groundname +","+ucMatch[0].ground_address + " " + ucMatch[0].groundcity +" " +  ucMatch[0].ground_zip;
				var umpiresFrom = "Umpires From : "+ucMatch[0].umpireteam1name +" & " + ucMatch[0].umpireteam2name;
				
				$("#matchDiv").append(match);
				$("#groundAddressDiv").append(ground);
				$("#umpiresFromDiv").append(umpiresFrom);
			});
	}

	function upcomingUmpireTask(){
		$.get("http://tennisballcricket.org/cricket_module/mobile_service.php?action=getTeamUmpireGamesDetails&tid=184",function(data,status){
				
		var ucMatch = $.parseJSON(data);
				
		var match = ucMatch[0].team1name + " vs " + ucMatch[0].team2name + " On " + formatedDate(ucMatch[0].match_date);	
		var ground = "At " + ucMatch[0].groundname +","+ucMatch[0].ground_address + " " + ucMatch[0].groundcity + " "+  ucMatch[0].ground_zip;
				var umpiresFrom = "Umpires From : "+ucMatch[0].umpireteam1name +" & " + ucMatch[0].umpireteam2name;
				
				$("#umpiringForDiv").append("<h5>"+match+"</h5>");
				$("#teamsForUmpringDiv").append("<h5>"+ground+"</h5>");
				$("#umpiringAddressDiv").append("<h5>"+umpiresFrom+"</h5>");
			});
	}

function formatedDate(dd){
	var date = new Date(dd);
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
	return  month + '/' + day + '/'+ year ;
 }
