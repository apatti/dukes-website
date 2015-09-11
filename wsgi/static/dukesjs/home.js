
 
$(document).ready(function(){

	$.get("http://tennisballcricket.com/bestteamplayers/184",function(data,status){
			var tca_id ='';
			var mom='';
			var pData = $.parseJSON(JSON.stringify(data));
			tca_id = pData.MoM;
            batsman = pData.Batsman;
            bowler = pData.Bowler;
			//mom = pData.name;
			updatePlayerOfTheWeekDiv(tca_id,batsman,bowler);
		});
		
		updatePlayerOfTheWeekDiv = function(tca_id,batsman,bowler){
            userData = getPlayerRecord(tca_id);
            if(userData!=null)
            {
                mom = userData.name;
				var playerOfTheWeek = '';
				if(userData['imagelink']==undefined)
                    userData['imagelink']="images/defaultuser.png";
				//var username ="pram.gottiganti";
				playerOfTheWeek = playerOfTheWeek + "<table><tr>";
				playerOfTheWeek = playerOfTheWeek + "<td><img  src='"+userData['imagelink']+"'  class='image' width='75px' height='75px'/></td>";
				playerOfTheWeek = playerOfTheWeek + "<td><h3><a href=/player.html?pid="+tca_id+">"+ mom +"</a></h3></td>";
				playerOfTheWeek = playerOfTheWeek + "</tr></table>";

				$("#playerOfTheWeekDiv").append(playerOfTheWeek);
            }
            batsmanData = getPlayerRecord(batsman.PlayerId);
            batsmanImage = "images/defaultuser.png";
            if (batsmanData!=null && batsmanData['imagelink']!=undefined)
            {
                batsmanImage=batsmanData['imagelink'];
            }
            var playerOfTheWeek = '';
            playerOfTheWeek = playerOfTheWeek + "<table cellspacing='0px'><tr>";
            playerOfTheWeek = playerOfTheWeek + "<td rowspan='2'><img  src='"+batsmanImage+"'  class='image' width='75px' height='75px'/></td>";
            playerOfTheWeek = playerOfTheWeek + "<td><h3><a href=/player.html?pid="+batsman.PlayerId+">"+ batsman.FirstName +" "+batsman.LastName+"</a></h3></td>";
            playerOfTheWeek = playerOfTheWeek + "<tr><td>("+batsman.RunScored +" of "+ batsman.BallFaced+")</td></tr>";
            playerOfTheWeek = playerOfTheWeek + "</tr></table>";
            $("#playerOfTheWeekDiv").append(playerOfTheWeek);
            bowlerData = getPlayerRecord(bowler.PlayerId);
            bowlerImage = "images/defaultuser.png";
            if (bowlerData!=null && bowlerData['imagelink']!=undefined)
            {
                bowlerImage=batsmanData['imagelink'];
            }
            var playerOfTheWeek = '';
            playerOfTheWeek = playerOfTheWeek + "<table cellspacing='0px'><tr>";
            playerOfTheWeek = playerOfTheWeek + "<td rowspan='2'><img  src='"+bowlerImage+"'  class='image' width='75px' height='75px'/></td>";
            playerOfTheWeek = playerOfTheWeek + "<td><h3><a href=/player.html?pid="+bowler.PlayerId+">"+ bowler.FirstName +" "+bowler.LastName+"</a></h3></td>";
            playerOfTheWeek = playerOfTheWeek + "<tr><td>("+bowler.Overs +"-"+ bowler.Maidens+"-"+bowler.Runs+"-"+bowler.Wickets+"-"+bowler.Wides+"w,"+bowler.Noballs+"n )</td></tr>";
            playerOfTheWeek = playerOfTheWeek + "</tr></table>";
            $("#playerOfTheWeekDiv").append(playerOfTheWeek);
            /*
			$.get("http://www.dukesxi.co/users/tca/"+tca_id,function(momData,status){
				var results = JSON.stringify(momData.user.results[0]);		
				var userData = $.parseJSON(results);

				mom = userData.name;
				var playerOfTheWeek = '';
				if(userData['imagelink']==undefined)
                    userData['imagelink']="images/defaultuser.png";
				//var username ="pram.gottiganti";
				playerOfTheWeek = playerOfTheWeek + "<table><tr>";
				playerOfTheWeek = playerOfTheWeek + "<td><img  src='"+userData['imagelink']+"'  class='image' width='75px' height='75px'/></td>";
				playerOfTheWeek = playerOfTheWeek + "<td><h3><a href=/player.html?pid="+tca_id+">"+ mom +"</a></h3></td>";
				playerOfTheWeek = playerOfTheWeek + "</tr></table>";
				
				$("#playerOfTheWeekDiv").append(playerOfTheWeek);
				
			})
                .always(function(error){
                    battingRecord = batsman.FirstName+" "+batsman.LastName+" "+batsman.RunScored+" ("+batsman.BallFaced+")";
                    var playerOfTheWeek = '';
                    playerOfTheWeek = playerOfTheWeek + "<table><tr>";
				    playerOfTheWeek = playerOfTheWeek + "<td><img  src='images/defaultuser.png'  class='image' width='75px' height='75px'/></td>";
				    playerOfTheWeek = playerOfTheWeek + "<td><h3><a href=/player.html?pid="+batsman.PlayerId+">"+ batsman.FirstName +" "+batsman.LastName+"</a></h3></td>";
                    playerOfTheWeek = playerOfTheWeek + "<td>("+batsman.RunScored +" of "+ batsman.BallFaced+")</td>";
				    playerOfTheWeek = playerOfTheWeek + "</tr></table>";
                    $("#playerOfTheWeekDiv").append(playerOfTheWeek);

                });
                */
		};
		upcomingMatch();
	});

    function getPlayerRecord(playerId)
    {
        var result = null;
        var scriptUrl = "http://www.dukesxi.co/users/tca/"+playerId;
        $.ajax({
        url: scriptUrl,
        type: 'get',
        dataType: 'json',
        async: false,
        success: function(data) {
            result = JSON.stringify(data.user.results[0])
            result = $.parseJSON(result);
            }
        });
        return result;
    }

	function upcomingMatch(){
		$.get("dukesgames",function(data,status){
		var games = $.parseJSON(data);
		var ucMatch = games['Game'];
        var ucUmpire = games['Umpiring'];
        if(ucMatch.length>0) {
            var match = "<p><strong>"+ucMatch[0]['Team1']['TeamName'] + " vs " + ucMatch[0]['Team2']['TeamName'] + "</strong></p><p>On " + ucMatch[0]['MatchDate']+"</p>";
            var ground = "At <a href='"+ucMatch[0].Link+"'>" + ucMatch[0]['PlaygroundName']+"</a>";
            var umpiresFrom = "Umpires From : " + ucMatch[0]['UmpTeam1']['TeamName'] + " & " + ucMatch[0]['UmpTeam2']['TeamName'];

            $("#matchDiv").append(match);
            $("#groundAddressDiv").append(ground);
            $("#umpiresFromDiv").append(umpiresFrom);
        }
        if(ucUmpire.length>0)
        {
            var match = "<p><strong>"+ucUmpire[0]['Team1']['TeamName'] + " vs " + ucUmpire[0]['Team2']['TeamName'] + "</strong></p><p>On " + ucUmpire[0]['MatchDate']+"</p>";
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
