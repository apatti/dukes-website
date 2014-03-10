var fbUserName='';
var DOMAIN_NAME = 'http://www.dukesxi.co';
window.fbAsyncInit = function() {
  FB.init({
    appId      : '627120887325860',
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });
   FB.Event.subscribe('auth.logout', function(response) {
	   logout();
	   $('#loginStatusDiv').show();
	   $('#successLoginDiv').hide();
	   location.reload();
		});
	FB.Event.subscribe('auth.login', function() {
		  location.reload();
	});
	 FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {	
			$('#loginStatusDiv').hide();	
			$('#successLoginDiv').show();			
			auction();					
		}else{
			$('#loginStatusDiv').show();
			$('#successLoginDiv').hide();
			
		}
	});
	
};
 function auction(){
	 FB.api('/me', function(response) {
		  console.log('Good to see you, ' + response.name + '.');	  
		  localStorage.setItem('USER_FB_INFO',JSON.stringify(response));
		
		   fbUserName = response.username;
		   $('#loggedUserDiv').html(response.username);	 
		   polling();
		});
 }
 
 
	function polling(){

        $.get("/ipl/users",function(data,status){

            $('#teamstab').puidatatable({
                lazy: true,
                caption: 'Registered IPL Teams',

                columns: [
                    {field:'name', headerText: 'OWNER', sortable:true},
                    {field:'iplteam', headerText: 'TEAM', sortable:true},
                    {field:'email', headerText: 'EMAIL', sortable:true}

                ],
                datasource: function(callback, ui) {

                    var pData = data.results;
                    callback.call(this, $.makeArray(pData));
                },
                selectionMode: 'single',
                rowSelect: function(event, data) {
                    $('#teamstab').puigrowl('show', [{severity:'info', summary: 'Row Selected', detail: (data.brand + ' ' + data.vin)}]);
                },
                rowUnselect: function(event, data) {
                    $('#teamstab').puigrowl('show', [{severity:'info', summary: 'Row Unselected', detail: (data.brand + ' ' + data.vin)}]);
                }
            });
        });


		return;
	}
	
