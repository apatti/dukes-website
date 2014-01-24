$(document).ready(function(){

	var statsObj='';
$.get("/team/stats",function(data,status){
	statsObj=data;
	$('#teamStatsDiv').puidatatable({
			lazy: true,
            caption: 'Batting Stats',           
            columns: [
                {field:'matches_played', headerText: 'Mat', sortable:false},
                {field:'wMatches', headerText: 'Wins', sortable:false},
                {field:'lMatches', headerText: 'Lost', sortable:false},
		{field:'tMatches', headerText: 'Match Draw', sortable:false}				
               ],
			   datasource: function(callback, ui) {  
					
					var pData = data;							
					callback.call(this, $.makeArray(pData));
				}         
	    });
	google.load("visualization","1",{packages:["corechart"]});
	google.setOnLoadCallback(drawChart);
	function drawChart(){
	    statsdata = new google.visualization.DataTable();
	    statsdata.addColumn('string','Date');
	    statsdata.addColumn('number','W/L Ratio');
	    for (var i=0;i<96;i++)
		{
		    var date = data.Games[i].match_date;
		    var ratio = data.Games[i].ratio;
		    statsdata.addRows([[date,parseInt(ratio)]]);
		}
	    var options={ title:'W/L Ratio'};
	    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
	    chart.draw(statsdata,options);
	}
	});
/*
google.load("visualization","1",{packages:["corechart"]});
google.setOnLoadCallback(drawChart);
function drawChart(){
    statsdata = new google.visualization.DataTable();
    statsdata.addColumn('string','Date');
    statsdata.addColumn('number','W/L Ratio');
    for (var i=0;i<96;i++)
	{
	    var date = data.Games[i].match_date;
	    var ratio = data.Games[i].ratio;
	    statsdata.addRows([[date,parseInt(ratio)]]);
	}
    var options={ title:'W/L Ratio'};
    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(statsdata,options);
}*/

});


function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}