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
        var teamtablehtml='<table><thead><tr>' +
            '<th>Name</th>' +
            '<th>BattingRuns</th>' +
            '<th>BattingBalls</th>' +
            '<th>NotOut</th>' +
            '<th>BowlingRuns</th>' +
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
            teamtablehtml+='<tr><td>'+team[index]+'</td>' +
                '<td><input type="text" id="'+team[index]+'battingRuns"></td>' +
                '<td><input type="text" id="'+team[index]+'battingBalls"></td>' +
                '<td><input type="checkbox" id="'+team[index]+'notOut"></td>' +
                '<td><input type="text" id="'+team[index]+'bowlingWickets"></td>' +
                '<td><input type="text" id="'+team[index]+'bowlingExtras"></td>' +
                '<td><input type="text" id="'+team[index]+'bowlingMaidenOvers"></td>' +
                '<td><input type="text" id="'+team[index]+'bowlingEconomy"></td>' +
                '<td><input type="text" id="'+team[index]+'fieldingCatches"></td>' +
                '<td><input type="text" id="'+team[index]+'fieldingStumping"></td>' +
                '<td><input type="text" id="'+team[index]+'fieldingRunOut"></td>' +
                '<td><input type="checkbox" id="'+team[index]+'IsMoM"></td></tr>';
        }
        teamtablehtml+='</table>';
        teamtablehtml+='<input type="button" id="submitpoints">Submit</input>'
        $('#teamDiv').html(teamtablehtml);
    });
}
