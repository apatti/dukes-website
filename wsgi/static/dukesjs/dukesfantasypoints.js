/**
 * Created by apatti on 4/2/14.
 */
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
		  if(fbUserName === 'pram.gottiganti' || fbUserName === 'ashwin.patti'){
               playingTeam();
               $('#noPermission').hide();
		   }else{
               $('#allTeamsDiv').hide();
				$('#noPermission').show();
		   }
		});
 }

function playingTeam()
{
    $.get("http://www.dukesxi.co/playingteam",function(data,status){
        var pollid= data.team.results[0].pollid;
        var team = data.team.results[0].team;
        var teamtablehtml='<table id="teamTable"><thead><tr>' +
            '<th>Name</th>' +
            '<th>BattingRuns</th>' +
            '<th>BattingBalls</th>' +
            '<th>NotOut</th>' +
            '<th>Wickets</th>' +
            '<th>Extras</th>' +
            '<th>Maidens</th>' +
            '<th>Economy</th>' +
            '<th>Catches</th>' +
            '<th>Stumpings</th>' +
            '<th>RunOuts</th>' +
            '<th>MoM</th>' +
            '</tr></thead>';
        for(var index=0;index<team.length;index++)
        {
            var player = team[index].split(' (')[0];
            teamtablehtml+='<tr><td>'+player+'</td>' +
                '<td><input type="number" id="'+player+'battingRuns"></td>' +
                '<td><input type="number" id="'+player+'battingBalls"></td>' +
                '<td><input type="checkbox" id="'+player+'notOut"></td>' +
                '<td><input type="number" id="'+player+'bowlingWickets"></td>' +
                '<td><input type="number" id="'+player+'bowlingExtras"></td>' +
                '<td><input type="number" id="'+player+'bowlingMaidenOvers"></td>' +
                '<td><input type="number" id="'+player+'bowlingEconomy"></td>' +
                '<td><input type="number" id="'+player+'fieldingCatches"></td>' +
                '<td><input type="number" id="'+player+'fieldingStumping"></td>' +
                '<td><input type="number" id="'+player+'fieldingRunOut"></td>' +
                '<td><input type="checkbox" id="'+player+'IsMoM"></td></tr>';
        }
        teamtablehtml+='</table>';
        teamtablehtml+='<input type="button" id="submitpoints" value="Submit"/>'
        $('#teamDiv').html(teamtablehtml);

        $('#submitpoints').click(function()
        {
            var teamtable = document.getElementById("teamTable");
            var teamJson=[];
            var playerJson={};
            for(var i=0;i<teamtable.rows.length;i++)
            {
                playerJson.player=teamtable.rows[i].cells[0].innerHTML;
                playerJson.battingRuns=teamtable.rows[i].cells[1].innerHTML;
                playerJson.battingBalls=teamtable.rows[i].cells[2].innerHTML;
                playerJson.notOut=teamtable.rows[i].cells[3].innerHTML;
                playerJson.bowlingWickets=teamtable.rows[i].cells[4].innerHTML;
                playerJson.bowlingExtras=teamtable.rows[i].cells[5].innerHTML;
                playerJson.bowlingMaidenOvers=teamtable.rows[i].cells[6].innerHTML;
                playerJson.bowlingEconomy=teamtable.rows[i].cells[7].innerHTML;
                playerJson.fieldingCatches=teamtable.rows[i].cells[8].innerHTML;
                playerJson.fieldingStumping=teamtable.rows[i].cells[9].innerHTML;
                playerJson.fieldingRunOut=teamtable.rows[i].cells[10].innerHTML;
                playerJson.IsMoM=teamtable.rows[i].cells[11].innerHTML;
                teamJson.push(playerJson);
            }
            alert(JSON.stringify(teamJson));
            /*
            $.ajax({
			    type: "POST",
			    contentType:'application/json',
			    url: '/fantasyscore',
			    data: JSON.stringify(teamJson),
			    dataType: 'json',
			    success: function(msg) {
			        alert("Points updated");
			        location.href="/";
		        }
		    });*/
        });

    });
}
