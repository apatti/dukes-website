$(document).ready(function()
{
	$.get("/umpirelist",function(data,status)
    {
	    google.load('visualization','1.0',{'packages':['table'],callback:drawChart});
		function drawChart()
		{
		    var datarow = new google.visualization.DataTable();
		    datarow.addColumn('string','User');
		    datarow.addColumn('string','Date');
		    datarow.addColumn('string','Year');
		    datarow.addColumn('string','Match');
            datarow.addColumn('string','location');
		    datarow.addColumn('string','Status');
		    for (var i=0;i<data.results.length;i++)
			{
			    var user = data.results[i].user;
			    var date=data.results[i].date;
			    var year=data.results[i].year;
			    var match=data.results[i].Match;
                var location = data.results[i].location;
			    var status=data.results[i].status;
		  	    datarow.addRows([[user,date,year.toString(),match,location,status]]);
			}
		    //var batroptions={ title:'Bets','height':600,vAxis:{title:'Runs'}};
		    var umpiretable = new google.visualization.Table(document.getElementById('umpires_chart_div'));
		    umpiretable.draw(datarow);
		}
    });
	
	
	
});