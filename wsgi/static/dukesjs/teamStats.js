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
	    var wlrStatsdata = new google.visualization.DataTable();
	    wlrStatsdata.addColumn('string','Match Date');
	    wlrStatsdata.addColumn('number','W/L Ratio');

	    var wlStatsdata = new google.visualization.DataTable();
            wlStatsdata.addColumn('string','Match Date');
            wlStatsdata.addColumn('number','Wins');
            wlStatsdata.addColumn('number','Loss');

	    for (var i=0;i<data.Games.length;i++)
		{
		    var date = data.Games[i].match_date;
		    var ratio = data.Games[i].ratio;
		    var wins = data.Games[i].win;
		    var loss = data.Games[i].loss;
		    wlrStatsdata.addRows([[date,parseFloat(ratio)]]);
		    wlStatsdata.addRows([[date,parseInt(wins),parseInt(loss)]]);
		}
	    var wlroptions={ title:'W/L Ratio','height':300,vAxis:{maxValue: 1,title:'Ratio'}};
	    var wlrchart = new google.visualization.LineChart(document.getElementById('wlr_chart_div'));
	    
	    var wloptions={ title:'Win/Loss Comparision','height':300,vAxis:{title:'Count'}};
            var wlchart = new google.visualization.LineChart(document.getElementById('wl_chart_div'));

	    var capStatsdata = new google.visualization.DataTable();
	    capStatsdata.addColumn('string','captain');
	    capStatsdata.addColumn('number','wins');
	    capStatsdata.addColumn('number','loss');
	    capStatsdata.addColumn('number','tie');
	    captains = JSON.parse(data.Captains);
	    for(var i=0;i<captains.length;i++)
		{
			if(captains[i]){
		    var captain = data.TeamPlayers.filter(function(team){return team.pid==captains[i];})[0];
		    var wins = data.CaptainWins[captain.pid]?data.CaptainWins[captain.pid]:0;
		    var loss = data.CaptainLosses[captain.pid]?data.CaptainLosses[captain.pid]:0;
		    var tie = data.CaptainTies[captain.pid]?data.CaptainTies[captain.pid]:0;
		    captain = captain.fname;
		    capStatsdata.addRows([[captain,wins,loss,tie]])
			}
		}
	    //capStatsdata.addRows([[data.CaptainLosses
	    var capoptions = {title:'Dukes XI Captains','height':300,
			      vAxis: {title:'Count'},
			      hAxis: {title:'Captain'}};
	    var capchart = new google.visualization.ColumnChart(document.getElementById('cap_chart_div'));
	    

	    wlrchart.draw(wlrStatsdata,wlroptions);
	    wlchart.draw(wlStatsdata,wloptions);
	    capchart.draw(capStatsdata,capoptions);
	    }
	});
});


function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}