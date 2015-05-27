
 
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
				if(userData['imagelink']==undefined)
                    userData['imagelink']="images/defaultuser.png";
				//var username ="pram.gottiganti";
				playerOfTheWeek = playerOfTheWeek + "<table><tr>";
				playerOfTheWeek = playerOfTheWeek + "<td><img  src='"+userData['imagelink']+"'  class='image' width='75px' height='75px'/></td>";
				playerOfTheWeek = playerOfTheWeek + "<td><h3><a href=/player.html?pid="+tca_id+">"+ mom +"</a></h3></td>";
				playerOfTheWeek = playerOfTheWeek + "</tr></table>";
				
				
				$("#playerOfTheWeekDiv").append(playerOfTheWeek);
				
			});
		};
		upcomingMatch();
	});

	function upcomingMatch(){
		$.get("dukesgames",function(data,status){
		var games = $.parseJSON(data);
		var ucMatch = games['Game'];
        var ucUmpire = games['Umpiring'];
        if(ucMatch.length>0) {
            var match = "<p><strong>"+ucMatch[0]['Team1']['TeamName'] + " vs " + ucMatch[0]['Team2']['TeamName'] + "</strong></p><h5>On " + ucMatch[0]['MatchDate']+"</h5>";
            var ground = "At <a href='"+ucMatch[0].Link+"'>" + ucMatch[0]['PlaygroundName']+"</a>";
            var umpiresFrom = "Umpires From : " + ucMatch[0]['UmpTeam1']['TeamName'] + " & " + ucMatch[0]['UmpTeam2']['TeamName'];

            $("#matchDiv").append(match);
            $("#groundAddressDiv").append(ground);
            $("#umpiresFromDiv").append(umpiresFrom);
        }
        if(ucUmpire.length>0)
        {
            var match = "<h4>"+ucUmpire[0]['Team1']['TeamName'] + " vs " + ucUmpire[0]['Team2']['TeamName'] + "</h4><br/><h5>On " + ucUmpire[0]['MatchDate']+"</h5>";
            var ground = "At <a href='"+ucUmpire[0].Link+"'>" + ucUmpire[0]['PlaygroundName']+"</a>";
            var umpiresFrom = "Umpires From : " + ucUmpire[0]['UmpTeam1']['TeamName'] + " & " + ucUmpire[0]['UmpTeam2']['TeamName'];
            $("#umpiringForDiv").append("<h5>"+match+"</h5>");
			$("#teamsForUmpringDiv").append("<h5>"+ground+"</h5>");
			$("#umpiringAddressDiv").append("<h5>"+umpiresFrom+"</h5>");
        }
        });
	}

function formatedDate(dd){
	var date = new Date(dd);
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
	return  month + '/' + day + '/'+ year ;
 }
