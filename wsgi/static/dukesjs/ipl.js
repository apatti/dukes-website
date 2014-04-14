var fbUserName='';

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
           populateStandings();
           populateSchedule();
            populateFreeAgents();
            populateMyTeam();
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

function populateStandings()
{
    $.get("/ipl/standings",function(data,status){
        google.load('visualization','1.0',{'packages':['table'],callback:drawTable});
        function drawTable()
        {
            var datarow = new google.visualization.DataTable();
            datarow.addColumn('string','Team');
            datarow.addColumn('string','Owner');
            datarow.addColumn('string','W-L-T');
            datarow.addColumn('number','BatPoints');
            datarow.addColumn('number','BowlPoints');
            datarow.addColumn('number','FieldPoints');
            datarow.addColumn('number','MoMPoints');
            datarow.addColumn('number','WinnersPoints');
            datarow.addColumn('string','Budget')
            players = $.parseJSON(JSON.stringify(data));
            for(var i=0;i<players.results.length;i++)
            {
                datarow.addRows([[players.results[i].teamname,
                                    players.results[i].username,
                                    players.results[i].wins+"-"+players.results[i].loss+"-"+players.results[i].ties,
                                    players.results[i].battingpoints,
                                    players.results[i].bowlingpoints,
                                    players.results[i].fieldingpoints,
                                    players.results[i].mompoints,
                                    players.results[i].winnerpoints,
                                    '$'+players.results[i].balance]]);
            }
            var standingstable = new google.visualization.Table(document.getElementById('standingstab'));
            //var options = {'height': 300, };
            standingstable.draw(datarow);

            google.visualization.events.addListener(standingstable, 'select', function() {
				var selection = standingstable.getSelection();
                alert(selection);
                var item = selection[1];
                alert(item);

				});
			}
    });
}

function populateSchedule()
{
    $.get("/ipl/schedule",function(data,status){

    });
}

function populateFreeAgents()
{
    $.get("/ipl/availableplayers",function(data,status){
        google.load('visualization','1.0',{'packages':['table'],callback:drawTable});
        function drawTable()
        {
            var datarow = new google.visualization.DataTable();
            datarow.addColumn('string','Name');
            datarow.addColumn('string','Team');
            datarow.addColumn('string','Type');
            players = $.parseJSON(JSON.stringify(data));
            for(var i=0;i<players.results.length;i++)
            {
                datarow.addRows([[players.results[i].Name,
                                    players.results[i].Team,
                                    players.results[i].Type]]);
            }
            var freeagentstable = new google.visualization.Table(document.getElementById('freeagentstab'));
            //var options = {'height': 300};
            freeagentstable.draw(datarow);
        }
    });
}

function populateMyTeam()
{
    $.get("/ipl/userteams/"+fbUserName,function(data,status){
        google.load('visualization','1.0',{'packages':['table'],callback:drawTable});
        function drawTable()
        {
            var datarow = new google.visualization.DataTable();
            datarow.addColumn('string','Name');
            datarow.addColumn('string','Team');
            datarow.addColumn('string','Type');
            datarow.addColumn('string','Price');
            players = $.parseJSON(JSON.stringify(data));
            for(var i=0;i<players.results.length;i++)
            {
                datarow.addRows([[players.results[i].Name,
                                    players.results[i].Team,
                                    players.results[i].Type,
                                    '$'+players.results[i].Price]]);
            }
            var myteamstable = new google.visualization.Table(document.getElementById('myteamtab'));
            //var options = {'height': 300};
            myteamstable.draw(datarow);
        }
    });
}

function updateTeamTable(){


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

}