$(document).ready(function(){
setHomePageCSS();
	var playerOfTheWeek = '';
	var ss = "Player of the Week is : Bulbul";
	playerOfTheWeek = playerOfTheWeek + "<table><tr>";
	playerOfTheWeek = playerOfTheWeek + "<td><img src='https://graph.facebook.com/"+pram.gottiganti+"/picture?type=normal'  class='image' width='100px' height='100px'/></td>";
	playerOfTheWeek = playerOfTheWeek + "<td>"+ ss +"</td>";
	playerOfTheWeek = playerOfTheWeek + "</tr></table>";
		
	$("#playerOfTheWeekDiv").html(playerOfTheWeek);
});

function setHomePageCSS(){
	$('#default').puipanel();
	$('#playerOfTheWeekDiv').puipanel();
	

	$('#options').puipanel({
		toggleable: true
		,closable: true
	});

	$('#horiztoggle').puipanel({
		toggleable: true
		,toggleOrientation: 'horizontal'
	});
}

