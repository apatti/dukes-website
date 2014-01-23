$(document).ready(function(){
duckesLogin();
setHomePageCSS();
 $.get("http://tennisballcricket.org/cricket_module/mobile_service.php?action=getTeamLastMoM&tid=184",function(data,status){
         var pData = $.parseJSON(data);
      
	var playerOfTheWeek = '';	
	//var username ="pram.gottiganti";
	playerOfTheWeek = playerOfTheWeek + "<table><tr>";
	playerOfTheWeek = playerOfTheWeek + "<td><img src='https://graph.facebook.com/"+fbUserName+"/picture?type=normal'  class='image' width='100px' height='100px'/></td>";
	playerOfTheWeek = playerOfTheWeek + "<td>"+ pData.name +"</td>";
	playerOfTheWeek = playerOfTheWeek + "</tr></table>";
		
	$("#playerOfTheWeekDiv").append(playerOfTheWeek);
	upcomingMatch();
	});
});

function upcomingMatch(){
	$('#upcomingMatchDiv').append('Upcoming Match is on Sunday');
}

function setHomePageCSS(){
	$('#default').puipanel();
	$('#playerOfTheWeekDiv').puipanel();
	$('#upcomingMatchDiv').puipanel();

	$('#options').puipanel({
		toggleable: true
		,closable: true
	});

	$('#horiztoggle').puipanel({
		toggleable: true
		,toggleOrientation: 'horizontal'
	});
}

