$(document).ready(function(){
var playerId = getParameterByName('pid');
	$.get("http://www.tennisballcricket.org/cricket_module/mobile_service.php?action=getPlayerStats&pid="+playerId+"",function(data,status){
	
	$('#battingStatsDiv').puidatatable({
			lazy: true,
            caption: 'Batting Stats',           
            columns: [
                {field:'matches_played', headerText: 'Mat', sortable:true},
                {field:'notout', headerText: 'NO', sortable:true},
                {field:'runs_scored', headerText: 'Runs', sortable:true},
				{field:'balls_faced', headerText: 'BF', sortable:true},
				{field:'mom', headerText: 'MOM', sortable:true},
				{field:'highest_score', headerText: 'HS', sortable:true},
				{field:'fifty', headerText: '50s', sortable:true},
				{field:'hundred', headerText: '100s', sortable:true},
				{field:'sixes', headerText: '6s', sortable:true},
				{field:'fours', headerText: '4s', sortable:true},
				{field:'batsman_average', headerText: 'Ave', sortable:true},
				{field:'batsman_strike_rate', headerText: 'SR', sortable:true},
				{field:'donot_bat', headerText: 'DNB', sortable:true}
               ],
			   datasource: function(callback, ui) {  
					
					var pData = $.parseJSON(data);
					$('#bestScoredDiv').html("<div id='userImgDiv'></div><div id='userNameDiv'></div><h3>Best Scored:</h3>"+pData['BattingStats']['best_score']);						
					//dataArray = pData['FieldStats'];
					//dataArray = [{'catches':'30','runouts': 2012, 'stumps':'23'}];						
					callback.call(this, $.makeArray(pData['BattingStats']));
				}         
        });
		
	$.get("http://www.dukesxi.co/users/tca/"+playerId,function(data,status){
				var results = JSON.stringify(data.user.results[0]);		
				var userData = $.parseJSON(results);
				$("#userNameDiv").html("<h3>"+userData['name']+"</br> </h3>");
				$("#userImgDiv").html("<img  src='https://graph.facebook.com/"+userData['username']+"/picture?type=normal'  class='image' width='75px' height='75px'/>");
				
	});
	$('#bowlingStatsDiv').puidatatable({
			lazy: true,
            caption: 'Bowling Stats',           
            columns: [
                {field:'overs', headerText: 'Ovr', sortable:true},
                {field:'maiden', headerText: 'Maiden', sortable:true},
                {field:'bowling_runs', headerText: 'Runs', sortable:true},
				{field:'wickets', headerText: 'Wkts', sortable:true},
				{field:'five_wickets', headerText: '5w', sortable:true},
				{field:'wides', headerText: 'Wides', sortable:true},
				{field:'noballs', headerText: 'NoB', sortable:true},
				{field:'extras', headerText: 'Ext', sortable:true},
				{field:'economy', headerText: 'Econ', sortable:true},
				{field:'bowling_average', headerText: 'Ave', sortable:true},
				{field:'bowling_strike_rate', headerText: 'SR', sortable:true},
				{field:'best_of_him', headerText: 'BBM', sortable:true}
               ],
			  /* datasource: [  
                {'catches':'30','runouts': 2012, 'stumps':'23'}] 
				*/
				 datasource: function(callback, ui) {  
					
					var pData = $.parseJSON(data);	
					$('#bestBowlingDiv').html("<h3>Best Bowling :</h3>"+pData['BowlingStats']['best_figures']);											
					//dataArray = pData['FieldStats'];
					//dataArray = [{'catches':'30','runouts': 2012, 'stumps':'23'}];						
					callback.call(this, $.makeArray(pData['BowlingStats']));
				}         
        });
	$('#fieldStatsDiv').puidatatable({
			lazy: true,
            caption: 'Fielding Stats',           
            columns: [
                {field:'catches', headerText: 'Catches', sortable:true},
                {field:'runouts', headerText: 'Runouts', sortable:true},
                {field:'stumps', headerText: 'Stumps', sortable:true}
               ],
			  /* datasource: [  
                {'catches':'30','runouts': 2012, 'stumps':'23'}] 
				*/
				 datasource: function(callback, ui) {  
					
					var pData = $.parseJSON(data);							
					//dataArray = pData['FieldStats'];
					//dataArray = [{'catches':'30','runouts': 2012, 'stumps':'23'}];						
					callback.call(this, $.makeArray(pData['FieldStats']));
				}         
        });
	google.load('visualization','1.0',{'packages':['corechart'],callback:drawChart});
        //google.setOnLoadCallback(drawChart);                                                                                                                                                                     
	function drawChart()
	{
	    var batting=JSON.parse(data).Batting;

	    var batrStatsdata = new google.visualization.DataTable();
            batrStatsdata.addColumn('string','Match Date');
            batrStatsdata.addColumn('number','Runs');
	    
	    for (var i=0;i<batting.games.length;i++)
                {
                    var date = batting.games[i].date;
                    var runs = batting.games[i].runs_scored;
		    batrStatsdata.addRows([[date,parseInt(runs)]]);
                 }
            var batroptions={ title:'Runs scored','height':300,vAxis:{title:'Runs'}};
            var batrchart = new google.visualization.LineChart(document.getElementById('bat_run_chart_div'));
	    batrchart.draw(batrStatsdata,batroptions);
	    
	    var batposStatsdata = new google.visualization.DataTable();
            batposStatsdata.addColumn('number','Position');
            batposStatsdata.addColumn('number','Games');
            batposStatsdata.addColumn('number','Runs');
	    
            for (var i=0;i<batting.positions.length;i++)
		{
		    var position = data.positions[i].batsman_position;
                    var posruns = data.positions[i].runs;
                    var posgames = data.positions[i].games;
                    batposStatsdata.addRows([[position,parseInt(posgames),parseInt(runs)]]);
                }
            var batposoptions={ title:'Runs scored per position','height':300,vAxis:{title:'Runs'}};
            var batposchart = new google.visualization.ColumnChart(document.getElementById('bat_pos_chart_div'));
	    batrchart.draw(batrStatsdata,batroptions);
	}
	    });
});


function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}