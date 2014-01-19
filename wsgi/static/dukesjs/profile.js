$(document).ready(function(){
 $(function() {
        $('#default').puipanel();
		var userData = $.parseJSON(localStorage.getItem('USER_FB_INFO'));
		$('#userPrfile').html("<h3> UserName : "+userData['name']+"</h3>");
	});
});

