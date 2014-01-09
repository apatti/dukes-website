$(document).ready(function(){
	//Adding Player Image
var playerId = getParameterByName('pid');	

 $.get("http://www.tennisballcricket.org/cricket_module/mobile_service.php?action=getPlayerStats&pid="+playerId+"",function(data,status){
         var pData = $.parseJSON(data);
		 $('.player_img').prepend('<img src="images/morne_morkel2-101x116.jpg" class="image" alt="Big Image" width="150px" height="150"/>');
		 $('#statsDiv').append('Total Matches :'+(pData['Stats'])['matches_played']).append('<br>');
		 $('#statsDiv').append('MoM :'+(pData['Stats'])['mom']).append('<br>');
		 $('#statsDiv').append('Total Runs :'+(pData['Stats'])['runs_scored']).append('<br>');
		 $('#statsDiv').append('Total Wickets :'+(pData['Stats'])['wickets']).append('<br>');
		 
		 //Batting stats
		 
		 var battingStats ='';
		 battingStats = battingStats + "<table border='1'>";
		  battingStats = battingStats +'<tr><th>Matchs</th><th>NOT</th><th>R</th><th>B</th><th>MoM</th><th>HS</th><th>NotScored</th>';
		 battingStats = battingStats + '<th>50s</th><th>100s</th><th>6s</th><th>4s</th><th>Avg</th><th>SR</th><th>BestScore</th><th>DNB</th></tr>';
		 battingStats = battingStats +'<tr>';
		 battingStats = battingStats +'<td>' + pData['BattingStats']['matches_played']+'</td>';
		 battingStats = battingStats + '<td>'+ pData['BattingStats']['notout'] + '</td>';
		 battingStats = battingStats +'<td>' + pData['BattingStats']['runs_scored'] + '</td>';
		 battingStats = battingStats +'<td>' + pData['BattingStats']['balls_faced'] + '</td>';
		 battingStats = battingStats +'<td>' + pData['BattingStats']['mom'] + '</td>';
		 battingStats = battingStats +'<td>' + pData['BattingStats']['highest_score'] + '</td>';
		 battingStats = battingStats +'<td>' + pData['BattingStats']['not_scored'] + '</td>';
		 battingStats = battingStats +'<td>' + pData['BattingStats']['fifty'] + '</td>';
		 battingStats = battingStats +'<td>' + pData['BattingStats']['hundred'] + '</td>';
		 battingStats = battingStats +'<td>' + pData['BattingStats']['sixes'] + '</td>';
		 battingStats = battingStats +'<td>' + pData['BattingStats']['fours'] + '</td>';
		 battingStats = battingStats +'<td>' + pData['BattingStats']['batsman_average'] + '</td>';
		 battingStats = battingStats +'<td>' + pData['BattingStats']['batsman_strike_rate'] + '</td>';
		 battingStats = battingStats +'<td>' + pData['BattingStats']['best_score'] + '</td>';
		 battingStats = battingStats +'<td>' + pData['BattingStats']['donot_bat'] + '</td>';
		 battingStats = battingStats +'</tr></table>';
		$('#battingStatsDiv').html(battingStats);
		
		var bowlingStats ='';
		 bowlingStats = bowlingStats + "<table border='1'>";
		  bowlingStats = bowlingStats +'<tr><th>Overs</th><th>Maided</th><th>R</th><th>W</th><th>5w</th><th>wide</th><th>NB</th>';
		 bowlingStats = bowlingStats + '<th>Ext</th><th>Econ</th><th>Avg</th><th>SR</th><th>BFig</th><th>BEST</th></tr>';
		 bowlingStats = bowlingStats +'<tr>';
		 bowlingStats = bowlingStats +'<td>' + pData['BowlingStats']['overs']+'</td>';
		 bowlingStats = bowlingStats + '<td>'+ pData['BowlingStats']['maiden'] + '</td>';
		 bowlingStats = bowlingStats +'<td>' + pData['BowlingStats']['bowling_runs'] + '</td>';
		 bowlingStats = bowlingStats +'<td>' + pData['BowlingStats']['wickets'] + '</td>';
		 bowlingStats = bowlingStats +'<td>' + pData['BowlingStats']['five_wickets'] + '</td>';
		 bowlingStats = bowlingStats +'<td>' + pData['BowlingStats']['wides'] + '</td>';
		 bowlingStats = bowlingStats +'<td>' + pData['BowlingStats']['noballs'] + '</td>';
		 bowlingStats = bowlingStats +'<td>' + pData['BowlingStats']['extras'] + '</td>';
		 bowlingStats = bowlingStats +'<td>' + pData['BowlingStats']['economy'] + '</td>';
		 bowlingStats = bowlingStats +'<td>' + pData['BowlingStats']['bowling_average'] + '</td>';
		 bowlingStats = bowlingStats +'<td>' + pData['BowlingStats']['bowling_strike_rate'] + '</td>';
		 bowlingStats = bowlingStats +'<td>' + pData['BowlingStats']['best_figures'] + '</td>';
		 bowlingStats = bowlingStats +'<td>' + pData['BowlingStats']['best_of_him'] + '</td>';		 
		 bowlingStats = bowlingStats +'</tr></table>';
		$('#bowlingStatsDiv').html(bowlingStats);
		
		var fieldStats ='';
		 fieldStats = fieldStats + "<table border='1'>";
		 fieldStats = fieldStats +'<tr><th>Catches</th><th>Run Outs</th><th>Stumps</th></tr>';
		 fieldStats = fieldStats +'<tr>';
		 fieldStats = fieldStats +'<td>' + pData['FieldStats']['catches']+'</td>';
		 fieldStats = fieldStats + '<td>'+ pData['FieldStats']['runouts'] + '</td>';
		 fieldStats = fieldStats +'<td>' + pData['FieldStats']['stumps'] + '</td>';				 
		 fieldStats = fieldStats +'</tr></table>';
		$('#fieldStatsDiv').html(fieldStats);
		
    }); 
   
	//$('#runsDiv').append('Runs : 34');
	//$('#wicketsDiv').append('Wickets : 34');
	//$('#runrateDiv').append('Run Rate : 45.34');
	//$('#matchetsDiv').append('Matches : 45');
  
});

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}