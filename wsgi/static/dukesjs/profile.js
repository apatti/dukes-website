$(document).ready(function(){
 $(function() {
        $('#default').puipanel();
		var userData = $.parseJSON(localStorage.getItem('USER_FB_INFO'));
		$('#nameDiv').html("<h3>Name : </h>"+userData['name']);
		$('#locationDiv').html("<h3>Location : </h>"+userData['location']['name']);
		
	});
});

