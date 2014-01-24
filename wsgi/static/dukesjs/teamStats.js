$(document).ready(function(){
$.get("http://tennisballcricket.org/cricket_module/mobile_service.php?action=getTeamStatDetails&tid=184",function(data,status){
	
	$('#teamStatsDiv').puidatatable({
			lazy: true,
            caption: 'Batting Stats',           
            columns: [
                {field:'matches_played', headerText: 'Mat', sortable:false},
                {field:'wMatches', headerText: 'Wins', sortable:false},
                {field:'lMatches', headerText: 'Lost', sortable:true},
				{field:'tMatches', headerText: 'Match Draw', sortable:true}				
               ],
			   datasource: function(callback, ui) {  
					
					var pData = $.parseJSON(data);							
					callback.call(this, $.makeArray(pData));
				}         
        });
	});
});


function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}