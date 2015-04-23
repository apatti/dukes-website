
$(document).bind('login_complete', loggedIn);
$(document).bind('logout_complete', loggedOut);

function loggedOut(){
    //$('#link_standingtab').hide();
    $('#link_myteamtab').hide();
    $('#link_freeagentstab').hide();
    $('#link_bidstab').hide();
    $('#link_markettab').hide();
    $('#link_ownedplayerstab').hide();
    $('#link_scoretab').hide();
    $('#link_transactionstab').hide();
}

 function loggedIn(){
     var userData = JSON.parse(localStorage.getItem('USER_GOOGLE_INFO'));
     $.get("http://www.dukesxi.co/ipl/users/"+userData.username,function(data,status){
         if(data.results.length==0)
            return;
         userData= data.results[0];
         userName=userData.email.substr(0,userData.email.indexOf('@'));
         userId=userData.first_name;

            var email = userData.email;
            var iplTeamName = userData.iplteam;
         $('#iplTeamNameTxt').val(iplTeamName);
            if(email != ''){


               $('#emailTxt').val(email);
                //$('#emailTxt').attr('readonly');
            }

        $('#link_standingtab').show();
        $('#link_myteamtab').show();
        $('#link_freeagentstab').show();
        $('#link_bidstab').show();
        $('#link_markettab').show();
        $('#link_ownedplayerstab').show();
        $('#link_scoretab').show();
        $('#link_transactionstab').show();
        //registerEventHandlers();
        populateFreeAgents();
        //populateMyTeam();
        populateBidHistory();
         //populateMarket();
         //populateIplScoreView();
         populateOwnedPlayers();
         populateTransactions();
     })
         .fail(function(){
             $('#centerContent').html("<h3>Please sign in.</h3>")
         });
 }

$(document).ready(function(){
    loggedOut();
    populateCurrentWeekDetails();
    populateStandings();
    populateIplFantasySchedule();
    populateIplSchedule();
});

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
    populateStandingsLeague(1,"leagueAteamstable");
    populateStandingsLeague(2,"leagueBteamstable");
}

function populateStandingsLeague(leagueId,elementName)
{
    $.get("/ipl/league/"+leagueId+"/standings",function(data,status){
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
                                    players.standings[i].name,
                                    players.standings[i].wins+"-"+players.standings[i].loss+"-"+players.standings[i].ties,
                                    players.standings[i].battingpoints,
                                    players.standings[i].bowlingpoints,
                                    players.standings[i].fieldingpoints,
                                    players.standings[i].mompoints,
                                    players.standings[i].winnerpoints,
                                    '$'+players.standings[i].balance]]);
            }
            var standingstable = new google.visualization.Table(document.getElementById(elementName));
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
            //Since the group information is inside the game and not in games, the follwing hack.
            var gameheader='';
            if(games[i].team1.league==1)
            {
                gameheader ='<tr bgcolor="#daa520"><td  style="border:1px solid black;text-align: center;" colspan="7">Group - A Game ';
            }
            if(games[i].team1.league==2) {
                gameheader ='<tr bgcolor="#228b22"><td  style="border:1px solid black;text-align: center;" colspan="7">Group - B Game ';
            }
            if(games[i].team1.league==0)
            {
                gameheader ='<tr bgcolor="#d2691e"><td  style="border:1px solid black;text-align: center;" colspan="7">Finals Game ';
            }

            //gametablehtml+='<tr><td  style="border:1px solid black;text-align: center;" colspan="7">Group - ' + league+ ' Game '+(((i+1)%3)+1)+'</td> </tr>'
            gametablehtml+=gameheader+((i%3)+1)+'</td> </tr>'
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
    $("#faselectleague").change(function(){
        var leagueid=$(this).children(":selected").attr("id");
        if(leagueid!="default")
        {
            $.get("/ipl/league/"+leagueid+"/availableplayers",function(data,status){
                google.load('visualization','1.0',{'packages':['controls'],callback:drawTable});
                function drawTable()
                {
                    var datarow = new google.visualization.DataTable();
                    datarow.addColumn('string','');
                    datarow.addColumn('number','ID');
                    datarow.addColumn('string','ObjectId');
                    datarow.addColumn('string','Name');
                    datarow.addColumn('string','Team');
                    datarow.addColumn('string','Type');
                    players = $.parseJSON(JSON.stringify(data));
                    for(var i=0;i<players.results.length;i++)
                    {
                        datarow.addRows([[  '<img src="'+players.results[i].image+'"/>',
                                            players.results[i].ID,
                                            players.results[i].objectId,
                                            '<a href="'+players.results[i].link+'">'+players.results[i].Name+'</a>',
                                            players.results[i].Team,
                                            players.results[i].Type]]);
                    }
                    var filter = new google.visualization.ControlWrapper({
                        controlType: 'StringFilter',
                        containerId: 'freeagentssearch',
                        options:{
                            filterColumnIndex: 3,
                            matchType: 'any',
                            caseSensitive: false,
                            ui:{
                                label:'Search:'
                            }
                        }
                    });

                    //var freeagentstable = new google.visualization.Table(document.getElementById('freeagentsDiv'));
                    var freeagentstable = new google.visualization.ChartWrapper({
                        chartType:'Table',
                        containerId:'freeagentsDiv',
                        options:{
                            allowHtml: true
                        }
                    });

                    var freeagentsdb = new google.visualization.Dashboard(document.getElementById('freeagentsdb'));
                    freeagentsdb.bind(filter,freeagentstable);
                    //var options = {'height': 300};
                    freeagentsdb.draw(datarow,{allowHtml:true});

                    google.visualization.events.addListener(freeagentstable, 'select', function() {
                        var selection = freeagentstable.getChart().getSelection();
                        var dialogContent = '';
                        var dropDownStr =' <select id = "selectedTeamMemberId" class="selectgame">';
                        dropDownStr += '<option id="selectPlayerId">Select a Player</option>';

                        $.get(DOMAIN_NAME+"/ipl/userdroppableteams/"+userId,function(data,status){
                          var  players = $.parseJSON(JSON.stringify(data.result.userTeam));
                            if(players.length==0)
                            {
                                return;
                            }
                            $.each( players,function () {
                                dropDownStr = dropDownStr + "<option id='"+this.ID+'%'+this.objectId+'%'+this.Type+'%'+this.Name+'%'+this.Team+"'>"+this.Name+"</option>";
                            });
                            var bidAmount = '<div><input type="number" id="bidAmountTxt" value=0/></div>';
                            //var priority = '<div><input type="number" id="priorityTxt" value=0/></div>';
                            var buttonStr = '<div><input type="button" id="submitBid" value="Submit"/> </div>'
                            dialogContent = '<table>';
                            dialogContent = dialogContent + '<tr><td>Current Team : </td><td>'+dropDownStr+'</td></tr>';
                            dialogContent = dialogContent + '<tr><td>Bid Amount : </td><td>'+bidAmount+'</td></tr>';
                            //dialogContent = dialogContent + '<tr><td>Priority : </td><td>'+priority+'</td></tr>';
                            dialogContent = dialogContent + '<tr><td colspan="2">'+buttonStr+'</td></tr>';

                            dialogContent = dialogContent + '<table>';

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

                                var toBeDroppedID=$('#selectedTeamMemberId').children(":selected").attr("id");
                                if( toBeDroppedID === 'selectPlayerId'){
                                    alert("Select a player to drop off..");
                                    return;
                                }
                                if( parseInt($('#bidAmountTxt').val()) <= 0 ){
                                    alert("Bid Amount Should be more thank ZERO !!!");
                                    return;
                                }

                                var item = selection[0];
                                var id = freeagentstable.getDataTable().getFormattedValue(item.row, 1);
                                var objectId = freeagentstable.getDataTable().getFormattedValue(item.row, 2);
                                var playerName = freeagentstable.getDataTable().getFormattedValue(item.row, 3);
                                playerName=playerName.substring(playerName.indexOf('>')+1,playerName.indexOf('</a'));
                                var teamName = freeagentstable.getDataTable().getFormattedValue(item.row,4);

                                var droppedPlayer = toBeDroppedID.split('%');

                                var jsonData ={};
                                jsonData.league = leagueid;
                                jsonData.username = userId;
                                //jsonData.priority = parseInt($('#priorityTxt').val());
                                jsonData.priority = 1;

                                jsonData.bidAmount = parseInt($('#bidAmountTxt').val());
                                jsonData.playerTobeDropped ={};
                                jsonData.playerTobeDropped.ID = parseInt(droppedPlayer[0]);
                                jsonData.playerTobeDropped.objectId = droppedPlayer[1];
                                jsonData.playerTobeDropped.Type = droppedPlayer[2];
                                jsonData.playerTobeDropped.Name = droppedPlayer[3];
                                jsonData.playerTobeDropped.Team = droppedPlayer[4];

                                jsonData.newPlayer = {};
                                jsonData.newPlayer.ID = parseInt(freeagentstable.getDataTable().getFormattedValue(item.row, 1));
                                jsonData.newPlayer.objectId = freeagentstable.getDataTable().getFormattedValue(item.row, 2);
                                jsonData.newPlayer.Name = playerName;
                                jsonData.newPlayer.Team = teamName;
                                jsonData.newPlayer.Type = freeagentstable.getDataTable().getFormattedValue(item.row, 5);
                                    //alert(id+' '+objectId+' '+playerName +' '+playerToBeDropped);
                                console.log(JSON.stringify(jsonData));
                                var bidJSON  = JSON.stringify(jsonData);
                                $.ajax({
                                    type: 'POST',
                                    url: DOMAIN_NAME +'/ipl/league/'+leagueid+'/bids/fabid',
                                    dataType: 'json',
                                    contentType:'application/json',
                                    data:bidJSON,
                                    success: function(res,status,jqXHR){
                                       alert("Your bid has been registered");
                                        //location.reload();
                                    },
                                    error: function(jqXHR, textStatus, errorThrown){
                                        alert(textStatus, errorThrown);
                                    }

                                });
                                $('#biddingPopupId').dialog( "close" );
                            });
                            $('#biddingPopupId').dialog( "open" );

                        });

                    });
                }
            });
        }
    });

}

function populateOwnedPlayers()
{
    $.get("/ipl/ownedplayers",function(data,status) {
        google.load('visualization', '1.0', {'packages': ['controls'], callback: drawTable});
        function drawTable() {
            var datarow = new google.visualization.DataTable();
            datarow.addColumn('string', '');
            datarow.addColumn('string', 'Name');
            datarow.addColumn('string', 'Team');
            datarow.addColumn('string', 'Type');
            datarow.addColumn('string', 'Group A');
            datarow.addColumn('string', 'Group B');
            players = $.parseJSON(JSON.stringify(data));
            for (var i = 0; i < players.results.length; i++) {
                datarow.addRows([['<img src="' + players.results[i].image + '"/>',
                    '<a href="' + players.results[i].link + '">' + players.results[i].Name + '</a>',
                    players.results[i].Team,
                    players.results[i].Type,
                    players.results[i].owner1,
                    players.results[i].owner2]]);
            }
            var filter = new google.visualization.ControlWrapper({
                controlType: 'StringFilter',
                containerId: 'ownedplayerssearch',
                options: {
                    filterColumnIndex: 1,
                    matchType: 'any',
                    caseSensitive: false,
                    ui: {
                        label: 'Search:'
                    }
                }
            });

            //var freeagentstable = new google.visualization.Table(document.getElementById('freeagentsDiv'));
            var ownedplayerstable = new google.visualization.ChartWrapper({
                chartType: 'Table',
                containerId: 'ownedplayersDiv',
                options: {
                    allowHtml: true
                }
            });

            var ownedplayersdb = new google.visualization.Dashboard(document.getElementById('ownedplayerstab'));
            ownedplayersdb.bind(filter, ownedplayerstable);
            //var options = {'height': 300};
            ownedplayersdb.draw(datarow, {allowHtml: true});
        }
    });
}

function populateMarket()
{

    $("#marketselectleague").change(function() {
        var leagueid = $(this).children(":selected").attr("id");
        if (leagueid != "market_default") {
            if(leagueid=="market_1")
                leagueid="1";
            if(leagueid=="market_2")
                leagueid="2";
            $.get("/ipl/league/"+leagueid+"/market", function (data, status) {
                google.load('visualization', '1.0', {'packages': ['table'], callback: drawTable});
                function drawTable() {
                    var datarow = new google.visualization.DataTable();
                    datarow.addColumn('string', '');
                    datarow.addColumn('string','ID');
                    datarow.addColumn('string','ObjectId');
                    datarow.addColumn('string', 'Name');
                    datarow.addColumn('string', 'Team');
                    datarow.addColumn('string', 'Type');
                    datarow.addColumn('string', 'Price');
                    datarow.addColumn('string', 'Owner');
                    marketPlayers = $.parseJSON(JSON.stringify(data));
                    for (var i = 0; i < marketPlayers.results.length; i++) {
                        datarow.addRows([[marketPlayers.results[i].playerImageLink,
                            marketPlayers.results[i].ID,
                            marketPlayers.results[i].playerObjectId,
                            marketPlayers.results[i].playerNameLink,
                            marketPlayers.results[i].playerTeam,
                            marketPlayers.results[i].playerType,
                            '$' + marketPlayers.results[i].marketPrice,
                            marketPlayers.results[i].username]]);
                    }
                    var marketTable = new google.visualization.Table(document.getElementById('marketPlayersDiv'));
                    //var options = {'height': 300};
                    marketTable.draw(datarow,{allowHtml:true});
                    google.visualization.events.addListener(marketTable, 'select', function() {
                        var selection = marketTable.getSelection();
                        var dialogContent = '';
                        var dropDownStr =' <select id = "selectedTeamMemberId" class="selectgame">';
                        dropDownStr += '<option id="selectPlayerId">Select a Player</option>';

                        $.get(DOMAIN_NAME+"/ipl/userteams/"+userId,function(data,status){
                          var  players = $.parseJSON(JSON.stringify(data.result.userTeam));
                            if(players.length==0)
                            {
                                return;
                            }
                            $.each( players,function () {
                                dropDownStr = dropDownStr + "<option id='"+this.ID+'%'+this.objectId+'%'+this.Type+'%'+this.Name+'%'+this.Team+"'>"+this.Name+"</option>";
                            });
                            var bidAmount = '<div><input type="number" id="bidAmountTxt" value=0/></div>';
                            //var priority = '<div><input type="number" id="priorityTxt" value=0/></div>';
                            var buttonStr = '<div><input type="button" id="submitBid" value="Submit"/> </div>'
                            dialogContent = '<table>';
                            dialogContent = dialogContent + '<tr><td>Current Team : </td><td>'+dropDownStr+'</td></tr>';
                            dialogContent = dialogContent + '<tr><td>Bid Amount : </td><td>'+bidAmount+'</td></tr>';
                            //dialogContent = dialogContent + '<tr><td>Priority : </td><td>'+priority+'</td></tr>';
                            dialogContent = dialogContent + '<tr><td colspan="2">'+buttonStr+'</td></tr>';

                            dialogContent = dialogContent + '<table>';

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

                                var toBeDroppedID=$('#selectedTeamMemberId').children(":selected").attr("id");
                                if( toBeDroppedID === 'selectPlayerId'){
                                    alert("Select a player to drop off..");
                                    return;
                                }
                                if( parseInt($('#bidAmountTxt').val()) <= 0 ){
                                    alert("Bid Amount Should be more thank ZERO !!!");
                                    return;
                                }

                                var item = selection[0];
                                var id = datarow.getFormattedValue(item.row, 1);
                                var objectId = datarow.getFormattedValue(item.row, 2);
                                var playerName = datarow.getFormattedValue(item.row, 3);
                                playerName=playerName.substring(playerName.indexOf('>')+1,playerName.indexOf('</a'));
                                var teamName = datarow.getFormattedValue(item.row,4);

                                var droppedPlayer = toBeDroppedID.split('%');

                                var jsonData ={};
                                jsonData.league = leagueid;
                                jsonData.username = userId;
                                jsonData.priority = 1;

                                jsonData.bidAmount = parseInt($('#bidAmountTxt').val());
                                jsonData.playerTobeDropped ={};
                                jsonData.playerTobeDropped.ID = parseInt(droppedPlayer[0]);
                                jsonData.playerTobeDropped.objectId = droppedPlayer[1];
                                jsonData.playerTobeDropped.Type = droppedPlayer[2];
                                jsonData.playerTobeDropped.Name = droppedPlayer[3];
                                jsonData.playerTobeDropped.Team = droppedPlayer[4];

                                jsonData.newPlayer = {};
                                jsonData.newPlayer.ID = parseInt(datarow.getFormattedValue(item.row, 1));
                                jsonData.newPlayer.objectId = datarow.getFormattedValue(item.row, 2);
                                jsonData.newPlayer.Name = playerName;
                                jsonData.newPlayer.Team = teamName;
                                jsonData.newPlayer.Type = datarow.getFormattedValue(item.row, 5);
                                    //alert(id+' '+objectId+' '+playerName +' '+playerToBeDropped);
                                console.log(JSON.stringify(jsonData));
                                var bidJSON  = JSON.stringify(jsonData);
                                $.ajax({
                                    type: 'POST',
                                    url: DOMAIN_NAME +'/ipl/league/'+leagueid+'/bids/marketbid',
                                    dataType: 'json',
                                    contentType:'application/json',
                                    data:bidJSON,
                                    success: function(res,status,jqXHR){
                                       alert("Your bid has been registered");
                                        //location.reload();
                                    },
                                    error: function(jqXHR, textStatus, errorThrown){
                                        alert(textStatus, errorThrown);
                                    }

                                });
                                $('#biddingPopupId').dialog( "close" );
                            });
                            $('#biddingPopupId').dialog( "open" );

                        });

                    });
                }
            });
        }
    });
}

function populateMyTeam()
{
    $.get("/ipl/userteams/"+userId,function(data,status){
        google.load('visualization','1.0',{'packages':['table'],callback:drawTable});
        function drawTable()
        {
            var datarow = new google.visualization.DataTable();
            datarow.addColumn('string','');
            datarow.addColumn('number','Id');
            datarow.addColumn('string','ObjectId');
            datarow.addColumn('string','Name');
            datarow.addColumn('string','Team');
            datarow.addColumn('string','Type');
            userLeague =$.parseJSON(JSON.stringify(data)).result.userData.league;
            players = $.parseJSON(JSON.stringify(data)).result.userTeam;
            for(var i=0;i<players.length;i++)
            {
                datarow.addRows([[ '<img src="'+players[i].image+'"/>',
                                    players[i].ID,
                                    players[i].objectId,
                                    '<a href="'+players[i].link+'">'+players[i].Name+'</a>',
                                    players[i].Team,
                                    players[i].Type]]);
            }
            var myteamstable = new google.visualization.Table(document.getElementById('myteamplayers'));
            //var options = {'height': 300};
            myteamstable.draw(datarow,{allowHtml:true});
            populateUserBids(userId,userLeague);
            populateUserMarket(userId, userLeague);

            google.visualization.events.addListener(myteamstable,'select',function(){
                var selection = myteamstable.getSelection();
                var dialogContent = '';
                var marketAmount = '<div><input type="number" id="marketAmountTxt" value=0/></div>';
                var buttonStr = '<div><input type="button" id="submitMarket" value="Put on market"/> </div>'
                dialogContent = '<table>';
                dialogContent = dialogContent + '<tr><td>Market Price : </td><td>'+marketAmount+'</td></tr>';
                dialogContent = dialogContent + '<tr><td colspan="2">'+buttonStr+'</td></tr>';
                dialogContent = dialogContent + '</table>';
                $('#marketPopupId').html(dialogContent);

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

                $('#submitMarket').click(function () {
                    var item = selection[0];
                    var playerImageLink = datarow.getFormattedValue(item.row,0);
                    var ID = datarow.getFormattedValue(item.row,1);
                    var objectId = datarow.getFormattedValue(item.row, 2);
                    var playerNameLink = datarow.getFormattedValue(item.row, 3);
                    playerName=playerNameLink.substring(playerNameLink.indexOf('>')+1,playerNameLink.indexOf('</a'));
                    var teamName = datarow.getFormattedValue(item.row,4);

                    var jsonData ={};
                    jsonData.league=userLeague;
                    jsonData.username = userId;
                    jsonData.playername=playerName;
                    jsonData.playerObjectId=objectId;
                    jsonData.ID=ID;
                    jsonData.playerTeam = teamName;
                    jsonData.playerType=datarow.getFormattedValue(item.row, 5);
                    jsonData.playerImageLink=playerImageLink;
                    jsonData.playerNameLink=playerNameLink;
                    jsonData.marketPrice= parseInt($('#marketAmountTxt').val());
                    console.log(JSON.stringify(jsonData));
                    var marketJSON  = JSON.stringify(jsonData);
                    $.ajax({
                        type: 'POST',
                        url: DOMAIN_NAME +'/ipl/league/'+userLeague+'/market',
                        dataType: 'json',
                        contentType:'application/json',
                        data:marketJSON,
                        success: function(res,status,jqXHR){
                           alert("Your market entry has been registered");
                            //location.reload();
                        },
                        error: function(jqXHR, textStatus, errorThrown){
                            alert(textStatus, errorThrown);
                        }

                    });
                    $('#marketPopupId').dialog( "close" );
                });

                $('#marketPopupId').dialog( "open" );

            });

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
            datarow.addColumn('string','');
            datarow.addColumn('string','Name');
            datarow.addColumn('string','Team');
            datarow.addColumn('string','Type');
            players = $.parseJSON(JSON.stringify(data)).result.userTeam;
            for(var i=0;i<players.length;i++)
            {
                datarow.addRows([['<img src="'+players[i].image+'"/>',
                                    players[i].Name,
                                    players[i].Team,
                                    players[i].Type]]);
            }
            var myteamstable = new google.visualization.Table(document.getElementById('playerteamtable'));
            //var options = {'height': 300};
            myteamstable.draw(datarow,{allowHtml:true});
        }
    });
}

function populateUserBids(username,leagueid)
{
    $.get("/ipl/league/"+leagueid+"/bids/"+username,function(data,status){
        google.load('visualization','1.0',{'packages':['table'],callback:drawTable});
        function drawTable()
        {
            var datarow = new google.visualization.DataTable();
            datarow.addColumn('string', 'Date');
            datarow.addColumn('string','Add');
            datarow.addColumn('string','Drop');
            datarow.addColumn('string','Price');
            datarow.addColumn('string','Type of Bid');
            datarow.addColumn('string','Priority');
            playerBids = $.parseJSON(JSON.stringify(data));
            var lastbidamount=0;
            for(var i=0;i<playerBids.results.length;i++)
            {
                //var date = new Date(playerBids.results[i].createdAt);
                var date = playerBids.results[i].createdAt;
                var updownbtn = '<input type="button" name="'+playerBids.results[i].objectId+'+_deletebtn" value="&#10006" onclick="bidCancelBtn('+i+', playerBids.results,'+leagueid+')" />';
                if(lastbidamount==playerBids.results[i].bidamount) {
                    updownbtn='<input type="button" name="'+playerBids.results[i].objectId+'_upbtn" value="&#x2B06" onclick="bidUpBtn('+i+', playerBids.results,'+leagueid+')" />'+
                                '<input type="button" name="'+playerBids.results[i].objectId+'_downbtn" value="&#x2B07" onclick="bidDownBtn('+i+', playerBids.results,'+leagueid+')" />'+
                                updownbtn;
                }
                datarow.addRows([[date,playerBids.results[i].playertoaddname+'-'+playerBids.results[i].playertoaddteam+'-'+playerBids.results[i].playertoaddtype,
                                    playerBids.results[i].playertodropname+'-'+playerBids.results[i].playertodropteam+'-'+playerBids.results[i].playertodroptype,
                                    '$'+playerBids.results[i].bidamount,(playerBids.results[i].marketbid==1)?'Market Bid':'FA Bid',
                                    updownbtn
                                    ]]);
                lastbidamount=playerBids.results[i].bidamount;
            }
            var myteambidtable = new google.visualization.Table(document.getElementById('playerbidtable'));
            //var options = {'height': 300};
            myteambidtable.draw(datarow,{allowHtml:true});
        }
    });
}

function populateUserMarket(username,leagueid)
{
    $.get("/ipl/league/"+leagueid+"/market/"+username,function(data,status){
        google.load('visualization','1.0',{'packages':['table'],callback:drawTable});
        function drawTable()
        {
            var datarow = new google.visualization.DataTable();
            datarow.addColumn('date', 'Date');
            datarow.addColumn('string','objectId');
            datarow.addColumn('string','playername');
            datarow.addColumn('string','playerTeam');
            datarow.addColumn('string','playerType');
            datarow.addColumn('string','marketPrice');
            datarow.addColumn('string','');
            playerMarket = $.parseJSON(JSON.stringify(data));
            var lastbidamount=0;
            for(var i=0;i<playerMarket.results.length;i++)
            {
                var date = new Date(playerMarket.results[i].createdAt);
                var updownbtn = '<input type="button" name="'+playerMarket.results[i].objectId+'+_mdeletebtn" value="&#10006" onclick="marketCancelBtn('+i+',playerMarket.results,'+leagueid+')" />';

                datarow.addRows([[date,playerMarket.results[i].objectId,playerMarket.results[i].playername,playerMarket.results[i].playerTeam,
                                    playerMarket.results[i].playerType,'$'+playerMarket.results[i].marketPrice,
                                    updownbtn
                                    ]]);
            }
            var myteammarkettable = new google.visualization.Table(document.getElementById('playermarkettable'));
            //var options = {'height': 300};
            myteammarkettable.draw(datarow,{allowHtml:true});
        }
    });
}

function marketCancelBtn(i,data, league)
{
    $.ajax({
        type: 'PUT',
        url: DOMAIN_NAME +'/ipl/league/'+league+'/market/'+data[i].objectId,
        dataType: 'json',
        contentType:'application/json',
        data:'',
        success: function(res,status,jqXHR){
            populateUserMarket(userId,league)
            //location.reload();
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert(textStatus, errorThrown);
        }

    });
}

function bidCancelBtn(i, data, league)
{
    data[i].priority=-1;
    jsonData=[]
    jsonData.push(data[i]);
    var bidJSON  = JSON.stringify(jsonData);
    $.ajax({
        type: 'PUT',
        url: DOMAIN_NAME +'/ipl/league/'+league+'/bids',
        dataType: 'json',
        contentType:'application/json',
        data:bidJSON,
        success: function(res,status,jqXHR){
            populateUserBids(userId,league)
            //location.reload();
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert(textStatus, errorThrown);
        }

    });
}

function bidUpBtn(i, data,league)
{
    if(i==0)
    {
        return;
    }
    var oldPriority=data[i].priority;
    data[i].priority=data[i-1].priority;
    data[i-1].priority=oldPriority;
    jsonData=[]
    jsonData.push(data[i-1]);
    jsonData.push(data[i]);
    var bidJSON  = JSON.stringify(jsonData);
    $.ajax({
        type: 'PUT',
        url: DOMAIN_NAME +'/ipl/league/'+league+'/bids',
        dataType: 'json',
        contentType:'application/json',
        data:bidJSON,
        success: function(res,status,jqXHR){
            populateUserBids(userId,league)
            //location.reload();
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert(textStatus, errorThrown);
        }

    });
}

function bidDownBtn(i, data,league)
{
    if(i+1==data.length||data[i].bidAmount>data[i+1].bidAmount)
    {
        return;
    }
    var oldpriority = data[i].priority;
    data[i].priority=data[i+1].priority;
    data[i+1].priority = oldpriority;
    jsonData=[]
    jsonData.push(data[i+1]);
    jsonData.push(data[i]);
    var bidJSON  = JSON.stringify(jsonData);
    $.ajax({
        type: 'PUT',
        url: DOMAIN_NAME +'/ipl/league/'+league+'/bids',
        dataType: 'json',
        contentType:'application/json',
        data:bidJSON,
        success: function(res,status,jqXHR){
            populateUserBids(userId,league)
            //location.reload();
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert(textStatus, errorThrown);
        }

    });
}

function populateTransactions()
{
    $("#transactionselectleague").change(function() {
        var leagueid = $(this).children(":selected").attr("id");
        if (leagueid != "transaction_default") {
            if(leagueid=="transaction_1")
                leagueid="1";
            if(leagueid=="transaction_2")
                leagueid="2";
            $.get("/ipl/league/"+leagueid+"/transactions", function (data, status) {
                google.load('visualization', '1.0', {'packages': ['table'], callback: drawTable});
                function drawTable() {
                    var datarow = new google.visualization.DataTable();
                    datarow.addColumn('date', 'Date');
                    datarow.addColumn('string', 'Claim');
                    datarow.addColumn('string', 'User');
                    datarow.addColumn('string', 'Bid');
                    datarow.addColumn('string', 'Result');
                    playerBids = $.parseJSON(JSON.stringify(data));
                    for (var i = 0; i < playerBids.results.length; i++) {
                        var date = new Date(playerBids.results[i].createdAt);
                        var claim = playerBids.results[i].playertoaddname +"("+playerBids.results[i].playertoaddteam+" - "+playerBids.results[i].playertoaddtype+")";
                        var res ="";
                        switch(playerBids.results[i].bidresult)
                        {
                            case 1:
                                res = '<strong>Added.</strong><br/>Dropped<br/>'+playerBids.results[i].playertodropname+'<br/>('+playerBids.results[i].playertodropteam+' - '+playerBids.results[i].playertodroptype+')';
                                break;
                            case 2:
                                res ='Outbid';
                                break;
                            case 3:
                                res ='Lower waiver priority';
                                break;
                            case 4:
                                res ='Player no longer available';
                                break;
                            case 5:
                                res ='Player to drop no longer in the team';
                                break;
                            case 6:
                                res ='Invalid team configuation';
                                break;
                            case 7:
                                res ='Insufficient funds';
                                break;
                        }
                        datarow.addRows([[//"Date("+date.getFullYear()+","+date.getMonth()+","+date.getDay()+","+date.getHours()+","+date.getMinutes()+","+date.getSeconds()+","+date.getMilliseconds()+")",
                            new Date(date.getFullYear(), date.getMonth(), date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds(),date.getMilliseconds()),
                            playerBids.results[i].playertoaddname,
                            playerBids.results[i].owner,
                            '$'+playerBids.results[i].amount,
                            res]]);
                    }
                    var transactiontable = new google.visualization.Table(document.getElementById('transactionsDiv'));
                    //var options = {'height': 300};
                    transactiontable.draw(datarow,{allowHtml:true});
                }
            });
        }
    });
}

function populateBidHistory()
{
    $("#bidselectleague").change(function() {
        var leagueid = $(this).children(":selected").attr("id");
        if (leagueid != "bid_default") {
            if(leagueid=="bid_1")
                leagueid="1";
            if(leagueid=="bid_2")
                leagueid="2";
            $.get("/ipl/league/"+leagueid+"/bids", function (data, status) {
                google.load('visualization', '1.0', {'packages': ['table'], callback: drawTable});
                function drawTable() {
                    var datarow = new google.visualization.DataTable();
                    datarow.addColumn('date', 'Date');
                    datarow.addColumn('string', 'User');
                    datarow.addColumn('string', 'Add');
                    datarow.addColumn('string', 'Drop');
                    datarow.addColumn('number', 'Priority');
                    datarow.addColumn('string', 'Price');
                    datarow.addColumn('string', 'Bid Type');
                    playerBids = $.parseJSON(JSON.stringify(data));
                    for (var i = 0; i < playerBids.results.length; i++) {
                        var date = new Date(playerBids.results[i].createdAt);

                        datarow.addRows([[//"Date("+date.getFullYear()+","+date.getMonth()+","+date.getDay()+","+date.getHours()+","+date.getMinutes()+","+date.getSeconds()+","+date.getMilliseconds()+")",
                            new Date(date.getFullYear(), date.getMonth(), date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds(),date.getMilliseconds()),
                            playerBids.results[i].owner,
                            playerBids.results[i].playertoaddname,
                            playerBids.results[i].playertodropname,
                            playerBids.results[i].priority,
                            '$' + playerBids.results[i].amount,(playerBids.results[i].marketbid==1)?'Market Bid':'FA Bid']]);
                    }
                    var bidtable = new google.visualization.Table(document.getElementById('bidsDiv'));
                    //var options = {'height': 300};
                    bidtable.draw(datarow);
                }
            });
        }
    });
}

function populateIplScoreView()
{
    $.get("/fantasy/scorecard/829747",function(data,status){
        google.load('visualization','1.0',{'packages':['table'],callback:drawTable});
        function drawTable()
        {
            var datarow = new google.visualization.DataTable();
            datarow.addColumn('string','Name');
            datarow.addColumn('number','Batting Points');
            datarow.addColumn('number','Bowling Points');
            datarow.addColumn('number','Fielding Points');
            datarow.addColumn('number','Total Points');
            score = $.parseJSON(data);
            for(var i=0;i<score.result.length;i++)
            {
                var batPoints=0;
                var bowlPoints=0;
                if(score.result[i]['batstats'])
                    batPoints = score.result[i].batstats.runPoints;

                if(score.result[i]['bowlstats'])
                    bowlPoints = score.result[i].bowlstats.wicketPoints;

                datarow.addRows([[score.result[i].name,batPoints,bowlPoints,score.result[i].fieldPoints,score.result[i].totalPoints]]);
            }
            var scoretable = new google.visualization.Table(document.getElementById('iplscoreDiv'));
            //var options = {'height': 300};
            scoretable.draw(datarow);
        }
    });
}

function populateIplFantasySchedule()
{
    $.get("/ipl/fantasyschedule",function(data,status){
        google.load('visualization','1.0',{'packages':['table'],callback:drawTable});
        function drawTable()
        {
            var datarow = new google.visualization.DataTable();
            datarow.addColumn('number','Week Number');
            datarow.addColumn('string','Fantasy Week');
            datarow.addColumn('string','Games');
            schedule = $.parseJSON(JSON.stringify(data));
            for(var i=0;i<schedule.result.length;i++)
            {
                if(schedule.result[i].league==1)
                {
                    matchTitle='Pool A'
                }
                if(schedule.result[i].league==2)
                {
                    matchTitle='Pool B'
                }
                if(schedule.result[i].league==0)
                {
                    matchTitle='Finals'
                }
                gamesText = matchTitle + " - "+schedule.result[i].team1+" v "+schedule.result[i].team2;
                datarow.addRows([[schedule.result[i].fantasyweek,schedule.result[i].fantasyweekname,
                                    gamesText]]);
            }
            var scheduletable = new google.visualization.Table(document.getElementById('iplfantasyscheduleDiv'));
            //var options = {'height': 300};
            scheduletable.draw(datarow);
        }
    });
}

function populateIplSchedule()
{
    $.get("/ipl/schedule",function(data,status){
        google.load('visualization','1.0',{'packages':['table'],callback:drawTable});
        function drawTable()
        {
            var datarow = new google.visualization.DataTable();
            datarow.addColumn('string','Date');
            datarow.addColumn('number','Match Id');
            datarow.addColumn('string','Fantasy Week');
            datarow.addColumn('string','Match');
            datarow.addColumn('string','Time');
            datarow.addColumn('string','Venue');
            schedule = $.parseJSON(JSON.stringify(data));
            for(var i=0;i<schedule.results.length;i++)
            {
                datarow.addRows([[schedule.results[i].date,
                                    schedule.results[i].matchid,
                                    schedule.results[i].fantasyweek,
                                    schedule.results[i].match,
                                    schedule.results[i].time,
                                    schedule.results[i].venue]]);
            }
            var scheduletable = new google.visualization.Table(document.getElementById('iplscheduleDiv'));
            //var options = {'height': 300};
            scheduletable.draw(datarow);
        }
    });
}