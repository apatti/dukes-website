$(document).ready(function(){
var playerId = getParameterByName('pid');
	$.get("http://tennisballcricket.com/teamplayerscore/player/"+playerId+"",function(data,status){
	
	$('#battingStatsDiv').puidatatable({
			lazy: true,
            caption: 'Batting Stats',           
            columns: [
                {field:'P', headerText: 'Mat', sortable:true},
                {field:'NO', headerText: 'NO', sortable:true},
                {field:'R', headerText: 'Runs', sortable:true},
				{field:'B', headerText: 'BF', sortable:true},
				{field:'Fifty', headerText: '50s', sortable:true},
				{field:'Hundred', headerText: '100s', sortable:true},
				{field:'Six', headerText: '6s', sortable:true},
				{field:'Four', headerText: '4s', sortable:true},
				{field:'Ave', headerText: 'Ave', sortable:true},
				{field:'SR', headerText: 'SR', sortable:true},
				{field:'DNB', headerText: 'DNB', sortable:true}
               ],
			   datasource: function(callback, ui) {  
					
					var pData = data['Batting'][0];
					$('#bestScoredDiv').html("<div id='userImgDiv'></div><div id='userNameDiv'></div><br/><h3>Best Score:</h3>"+pData['Best']);
					pData['Ave']=(pData['R']/parseFloat(pData['P']-pData['NO']-pData['DNB'])).toFixed(2);
                    pData['SR']=((pData['R']/parseFloat(pData['B']))*100).toFixed(2);
					callback.call(this, $.makeArray(pData));
				}         
        });
		
	$.get("http://www.dukesxi.co/users/tca/"+playerId,function(data,status){
				var results = JSON.stringify(data.user.results[0]);		
				var userData = $.parseJSON(results);
                if(userData['imagelink']==undefined)
                    userData['imagelink']="images/defaultuser.png";
				$("#userNameDiv").html("<h3>"+userData['name']+"</br> </h3>");
				$("#userImgDiv").html("<img  src='"+userData['imagelink']+"'  class='image' width='75px' height='75px'/>");
				
	});
	$('#bowlingStatsDiv').puidatatable({
			lazy: true,
            caption: 'Bowling Stats',           
            columns: [
                {field:'Overs', headerText: 'Ovr', sortable:true},
                {field:'Maidens', headerText: 'Maiden', sortable:true},
                {field:'Runs', headerText: 'Runs', sortable:true},
				{field:'Wickets', headerText: 'Wkts', sortable:true},
				{field:'Fifth', headerText: '5w', sortable:true},
				{field:'Wide', headerText: 'Wides', sortable:true},
				{field:'Noballs', headerText: 'NoB', sortable:true},
				{field:'Extras', headerText: 'Ext', sortable:true},
				{field:'Economy', headerText: 'Econ', sortable:true},
				{field:'Ave', headerText: 'Ave', sortable:true},
				{field:'SR', headerText: 'SR', sortable:true}
               ],
			  /* datasource: [  
                {'catches':'30','runouts': 2012, 'stumps':'23'}] 
				*/
				 datasource: function(callback, ui) {  
					
					var pData = data['Bowling'][0];
					$('#bestBowlingDiv').html("<h3>Best Bowling :</h3>"+pData['Best']);
                     pData['Extras']=pData['Wide']+pData['Noballs'];
                     pData['Economy']=((pData['Runs']/parseFloat(getNumberOfBalls(pData['Overs'])))*6).toFixed(2);
                     pData['Ave']=(pData['Runs']/parseFloat(pData['Wickets'])).toFixed(2);
                     pData['SR']=(getNumberOfBalls(pData['Overs'])/parseFloat(pData['Wickets'])).toFixed(2);
					callback.call(this, $.makeArray(pData));
				}         
        });
	$('#fieldStatsDiv').puidatatable({
			lazy: true,
            caption: 'Fielding Stats',           
            columns: [
                {field:'C', headerText: 'Catches', sortable:true},
                {field:'R', headerText: 'Runouts', sortable:true},
                {field:'S', headerText: 'Stumps', sortable:true}
               ],
			  /* datasource: [  
                {'catches':'30','runouts': 2012, 'stumps':'23'}] 
				*/
				 datasource: function(callback, ui) {  
					
					var pData = data['Fielding'][0];
					callback.call(this, $.makeArray(pData));
				}         
        });
    $.get("http://www.tennisballcricket.org/cricket_module/mobile_service.php?action=getPlayerStats&pid="+playerId+"",function(data,status){
	google.load('visualization','1.0',{'packages':['corechart'],callback:drawChart});
        function drawChart()
	{
	    var howOut = new Array();
	    howOut[14]="Ct";
	    howOut[15]="Ct-WK";
	    howOut[10]="Bowled";
	    howOut[13]="Run Out";
	    howOut[16]="Stumped";
	    howOut[11]="C&B";
	    howOut[12]="Hit wicket";
	    howOut[2]="Not Out";
	    howOut[1]="DNB";
	    howOut[3]="Handled the Ball";
	    howOut[4]="Obstructed Field";
	    howOut[5]="Hit ball twice";
	    howOut[6]="Timed Out";
	    howOut[7]="Retired Out";
	    howOut[8]="Retired Hurt";
	    howOut[9]="Absent";
	    howOut[17]="Run Out Substitute";
	    howOut[18]="Caught Subtitute";
	    howOut[19]="Double Hit";


	    var batting=JSON.parse(data).Batting;

	    var batrStatsdata = new google.visualization.DataTable();
            batrStatsdata.addColumn('string','Match Date');
            batrStatsdata.addColumn('number','Runs');
	    var runs=0;
	    for (var i=0;i<batting.games.length;i++)
                {
                    var date = batting.games[i].date;
                    runs = runs + parseInt(batting.games[i].runs_scored);
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
		    var position = batting.positions[i].batsman_position;
                    var posruns = batting.positions[i].runs;
                    var posgames = batting.positions[i].games;
                    batposStatsdata.addRows([[parseInt(position),parseInt(posgames),parseInt(posruns)]]);
                }
            var batposoptions={ title:'Runs scored per position','height':300,vAxis:{title:'Runs'}};
            var batposchart = new google.visualization.ColumnChart(document.getElementById('bat_pos_chart_div'));
	    batposchart.draw(batposStatsdata,batposoptions);
	    
	    var batoutStatsdata = new google.visualization.DataTable();
            batoutStatsdata.addColumn('string','HowOut');
            batoutStatsdata.addColumn('number','Games');

            for (var i=0;i<batting.outs.length;i++)
                {
                    var out = howOut[batting.outs[i].how_out];
                    var games = batting.outs[i].count;
                    batoutStatsdata.addRows([[out,parseInt(games)]]);
                }
            var batoutoptions={ title:'How out frequency','height':300,vAxis:{title:'Count'}};
            var batoutchart = new google.visualization.BarChart(document.getElementById('bat_out_chart_div'));
            batoutchart.draw(batoutStatsdata,batoutoptions);

	}
	    });
    });
});


function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getNumberOfBalls(over){
    var overCount = Math.floor(over);
    var ballCount = over - Math.floor(over);
    return overCount*6+ballCount;
}