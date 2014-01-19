$(document).ready(function(){
 $(function() {
        $('#default').puipanel();
		var name = localStorage.getItem('name');
		$('#userPrfile').html("<h3> UserName : "+name+"</h3>");
	});
});

