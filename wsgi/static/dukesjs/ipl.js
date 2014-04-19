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
           populateCurrentWeekDetails();
           populateStandings();
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
            for(var i=0;i<players.standings.length;i++)
            {
                datarow.addRows([[players.standings[i].teamname,
                                    players.standings[i].username,
                                    players.standings[i].wins+"-"+players.standings[i].loss+"-"+players.standings[i].ties,
                                    players.standings[i].battingpoints,
                                    players.standings[i].bowlingpoints,
                                    players.standings[i].fieldingpoints,
                                    players.standings[i].mompoints,
                                    players.standings[i].winnerpoints,
                                    '$'+players.standings[i].balance]]);
            }
            var standingstable = new google.visualization.Table(document.getElementById('allteamstable'));
            //var options = {'height': 300, };
            standingstable.draw(datarow);

            google.visualization.events.addListener(standingstable, 'select', function() {
				var selection = standingstable.getSelection();
                var player = datarow.getFormattedValue(selection[0].row, 1);
                populateUserTeam(player);
				});
			}
    });
}

function populateCurrentWeekDetails()
{
    $.get("/ipl/standings/currentweek",function(data,status){
        $('#weekdetails').html(data.standings.weekname+'  ('+data.standings.weekduration+')');
        var gametablehtml='<table style="border:2px solid black;"><tr><th>Teams</th><th>W-L-T</th><th>BattingPoints</th><th>BowlingPoints</th><th>FieldingPoints</th><th>MoMPoints</th><th>WinnerPoints</th></tr>';
        var games = data.standings.games;
        for(var i=0;i<games.length;i++)
        {
            gametablehtml+='<tr><td  style="border:1px solid black;text-align: center;" colspan="7">Game '+(i+1)+'</td> </tr>'
            gametablehtml+='<tr><td>'+games[i].team1.owner+"</td><td>"+games[i].team1.win+"-"+
                            games[i].team1.loss+"-"+games[i].team1.tie+"</td><td>"+
                            games[i].team1.battingpoints+"</td><td>"+
                            games[i].team1.bowlingpoints+"</td><td>"+
                            games[i].team1.fieldingpoints+"</td><td>"+
                            games[i].team1.mompoints+"</td><td>"+
                            games[i].team1.winpoints+"</td><td>"+
                            "</td></tr>";
            gametablehtml+='<tr><td>'+games[i].team2.owner+"</td><td>"+games[i].team2.win+"-"+
                            games[i].team2.loss+"-"+games[i].team2.tie+"</td><td>"+
                            games[i].team2.battingpoints+"</td><td>"+
                            games[i].team2.bowlingpoints+"</td><td>"+
                            games[i].team2.fieldingpoints+"</td><td>"+
                            games[i].team2.mompoints+"</td><td>"+
                            games[i].team2.winpoints+"</td><td>"+
                            "</td></tr>";
        }
        $('#gamestandings').html(gametablehtml);
    });
}

function populateFreeAgents()
{
    $.get("/ipl/availableplayers",function(data,status){
        google.load('visualization','1.0',{'packages':['table'],callback:drawTable});
        function drawTable()
        {
            var datarow = new google.visualization.DataTable();
            datarow.addColumn('number','Id');
            datarow.addColumn('string','ObjectId');
            datarow.addColumn('string','Name');
            datarow.addColumn('string','Team');
            datarow.addColumn('string','Type');
            players = $.parseJSON(JSON.stringify(data));
            for(var i=0;i<players.results.length;i++)
            {
                datarow.addRows([[  players.results[i].ID,
                                    players.results[i].objectId,
                                    players.results[i].Name,
                                    players.results[i].Team,
                                    players.results[i].Type]]);
            }
            var freeagentstable = new google.visualization.Table(document.getElementById('freeagentsDiv'));
            //var options = {'height': 300};
            freeagentstable.draw(datarow);

            google.visualization.events.addListener(freeagentstable, 'select', function() {
                var selection = freeagentstable.getSelection();
                var dialogContent = '';
                var dropDownStr ='<select class="selectgame">';
                dropDownStr += '<option id="total">Select a Player</option>';
                //+fbUserName
                $.get(DOMAIN_NAME+"/ipl/userteams/vivek.vennam",function(data,status){
                  var  players = $.parseJSON(JSON.stringify(data.results));

                    $.each( players,function () {
                        dropDownStr = dropDownStr + "<option value='"+this.objectId+"'>"+this.Name+"</option>";
                    });
                    var bidAmount = '<div><input type="number" id="bidAmountTxt" value=0></div>';
                    var buttonStr = '<div><input type="button" id="submitBid" value="Submit"/> </div>'

                    dialogContent = dialogContent + dropDownStr;
                    dialogContent = dialogContent + bidAmount;
                    dialogContent = dialogContent + buttonStr;

                 $('#biddingPopupId').html(dialogContent);

                    $( ".userDialog" ).dialog({
                        autoOpen: false,
                        show: {
                            effect: "blind",
                            duration: 1000
                        },
                        hide: {
                            effect: "explode",
                            duration: 1000
                        }
                    });
                    $('#submitBid').click(function () {

                            var item = selection[0];
                            var id = datarow.getFormattedValue(item.row, 0);
                            var objectId = datarow.getFormattedValue(item.row, 1);
                            var playerName = datarow.getFormattedValue(item.row, 2);

                        alert(id+' '+objectId+' '+playerName);
                    });
                    $('#biddingPopupId').dialog( "open" );

                });

            });
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


function populateUserTeam(username)
{
    $.get("/ipl/userteams/"+username,function(data,status){
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
            var myteamstable = new google.visualization.Table(document.getElementById('playerteamtable'));
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