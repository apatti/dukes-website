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
	   location.reload();
		});
	FB.Event.subscribe('auth.login', function() {
		  location.reload();
	});
	 FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {		
			loggedIn();					
		}else{
			//$('#pollsDiv').append('Please Login To See Poll');
		}
	});
	
};
 function loggedIn(){
	 FB.api('/me', function(response) {
		  console.log('Good to see you, ' + response.name + '.');	  
		  localStorage.setItem('USER_FB_INFO',JSON.stringify(response));
		
		   fbUserName = response.username;
		   $('#loggedUserDiv').html(response.username);	 
		   ipl_init();
           registerEventHandlers();
		});
 }
 
 
	function ipl_init(){
        $.get(DOMAIN_NAME+"/users/"+fbUserName,function(data,status){
            var results = JSON.stringify(data.user.results[0]);
            var userData = $.parseJSON(results);
            var email = userData.email;
            var iplTeamName = userData.iplteam;
            $('#iplTeamNameTxt').val(iplTeamName);
            if(email != ''){


               $('#emailTxt').val(email);
                //$('#emailTxt').attr('readonly');
            }
        });
	}
function registerEventHandlers(){
    $('#teamNameSubmitBtn').click(function (){
        var iplTeamObj = {};
        iplTeamObj.iplteam = $('#iplTeamNameTxt').val();
        iplTeamObj.email = $('#emailTxt').val();
        var iplTeamJSON  = JSON.stringify(iplTeamObj);
        $.ajax({
            type: 'POST',
            url: DOMAIN_NAME +'/ipl/users/'+fbUserName,
            dataType: 'json',
            contentType:'application/json',
            data:iplTeamJSON,
            success: function(res,status,jqXHR){
               alert("You IPL team has been registered");
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert(textStatus, errorThrown);
            }

        });
    });
}


$(document).ready(function(){


    $.get("/ipl/users",function(data,status){

        $('#teamstab').puidatatable({
            lazy: true,
            caption: 'Registered IPL Teams',
            paginator: {
                rows: 15
            },
            columns: [
                {field:'name', headerText: 'NAME', sortable:true},
                {field:'iplteam', headerText: 'TEAM NAME', sortable:true},
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

});