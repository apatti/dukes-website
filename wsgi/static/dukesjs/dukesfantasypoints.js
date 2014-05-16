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
    $.get("http://www.dukesxi.co/fantasyteam/zR1SI0BrKv",function(data,status){
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
                '<td><input type="number" id="'+player+'battingRuns" value=0></td>' +
                '<td><input type="number" id="'+player+'battingBalls" value=0></td>' +
                '<td><input type="checkbox" id="'+player+'notOut"></td>' +
                '<td><input type="number" id="'+player+'bowlingWickets" value=0></td>' +
                '<td><input type="number" id="'+player+'bowlingExtras" value=1></td>' +
                '<td><input type="number" id="'+player+'bowlingMaidenOvers" value=0></td>' +
                '<td><input type="number" id="'+player+'bowlingEconomy" value=-1></td>' +
                '<td><input type="number" id="'+player+'fieldingCatches" value=0></td>' +
                '<td><input type="number" id="'+player+'fieldingStumping" value=0></td>' +
                '<td><input type="number" id="'+player+'fieldingRunOut" value=0></td>' +
                '<td><input type="checkbox" id="'+player+'IsMoM"></td></tr>';
        }
        teamtablehtml+='</table>';
        teamtablehtml+='<input type="button" id="submitpoints" value="Submit"/>'
        $('#teamDiv').html(teamtablehtml);

        $('#submitpoints').click(function()
        {
            var teamtable = document.getElementById("teamTable");
            var teamJson=[];
            for(var i=1;i<teamtable.rows.length;i++)
            {
                var playerJson={};
                playerJson.player=teamtable.rows[i].cells[0].innerHTML;
                playerJson.battingRuns=parseInt(teamtable.rows[i].cells[1].children[0].value);
                playerJson.battingBalls=parseInt(teamtable.rows[i].cells[2].children[0].value);
                playerJson.notOut=document.getElementById(playerJson.player+"notOut").checked;
                playerJson.bowlingWickets=parseInt(teamtable.rows[i].cells[4].children[0].value);
                playerJson.bowlingExtras=parseInt(teamtable.rows[i].cells[5].children[0].value);
                playerJson.bowlingMaidenOvers=parseInt(teamtable.rows[i].cells[6].children[0].value);
                playerJson.bowlingEconomy=parseInt(teamtable.rows[i].cells[7].children[0].value);
                playerJson.fieldingCatches=parseInt(teamtable.rows[i].cells[8].children[0].value);
                playerJson.fieldingStumping=parseInt(teamtable.rows[i].cells[9].children[0].value);
                playerJson.fieldingRunOut=parseInt(teamtable.rows[i].cells[10].children[0].value);
                playerJson.IsMoM=document.getElementById(playerJson.player+"IsMoM").checked;
                teamJson.push(playerJson);
            }

            $.ajax({
			    type: "PUT",
			    contentType:'application/json',
			    url: '/fantasyscore/'+pollid,
			    data: JSON.stringify(teamJson),
			    dataType: 'json',
			    success: function(msg) {
			        alert("Points updated");
			        location.href="/";
		        }
		    });
        });

    });
}
