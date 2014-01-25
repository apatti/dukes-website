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
	google.load('visualization','1.0',{'packages':['corechart'],callback:drawChart});
	//google.setOnLoadCallback(drawChart);
	function drawChart(){
	    var wlStatsdata = new google.visualization.DataTable();
	    wlStatsdata.addColumn('string','Match Date');
	    wlStatsdata.addColumn('number','W/L Ratio');
	    for (var i=0;i<data.Games.length;i++)
		{
		    var date = data.Games[i].match_date;
		    var ratio = data.Games[i].ratio;
		    wlStatsdata.addRows([[date,parseFloat(ratio)]]);
		}
	    var wloptions={ title:'W/L Ratio','height':300,vAxis:{maxValue: 1}};
	    var wlchart = new google.visualization.LineChart(document.getElementById('wl_chart_div'));
	    
	    var capStatsdata = new google.visualization.DataTable();
	    capStatsdata.addColumn('string','captain');
	    capStatsdata.addColumn('number','wins');
	    capStatsdata.addColumn('number','loss');
	    capStatsdata.addColumn('number','tie');
	    captains = JSON.parse(data.Captains);
	    for(var i=0;i<captains.length;i++)
		{
		    var captain = captains[i];
		    var wins = data.CaptainWins[captain];
		    var loss = data.CaptainLoss[captain];
		    var tie = data.CaptainTies[captain];
		    capStatsdata.addRows([[captain,wins,loss,tie]])
		}
	    //capStatsdata.addRows([[data.CaptainLosses
	    var capoptions = {title:'Dukes XI Captains','height':300,
			      hAxis: {title:'Captain'}};
	    var capchart = new google.visualization.ColumnChart(document.getElemenetById('cap_chart_div'));
	    

	    wlchart.draw(wlStatsdata,wloptions);
	    //capchart.draw(capStatsdata,capoptions);
	    }
	});
});


function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}