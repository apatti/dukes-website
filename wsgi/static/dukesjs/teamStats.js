$(document).ready(function(){
$.get("/team/stats",function(data,status){
	
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
	});
});


function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}