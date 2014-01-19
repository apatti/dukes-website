$(document).ready(function(){
 $(function() {
        $('#default').puipanel();
		$('#basic').puidropdown();
		var userData = $.parseJSON(localStorage.getItem('USER_FB_INFO'));
		$('#nameDiv').html("<h3>Name : </h>"+userData['name']);
		$('#locationDiv').html("<h3>Location : </h>"+userData['location']['name']);
		$('#fbProfileImg').html("<img src='https://graph.facebook.com/"+userData['username']+"/picture?type=normal'  class='image' width='100px' height='100px'/>");
		
		
	});
});

