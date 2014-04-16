/**
 * Created by gunni on 4/15/2014.
 */
/**
 * Created by apatti on 4/2/14.
 */
/**
 * Created by apatti on 3/6/14.
 */
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
        $('#adminTabPanel').hide();
        $('#noPermission').show();
        $('#noPermission').append('Please Login To See Admin Dashboard');

        location.reload();
    });
    FB.Event.subscribe('auth.login', function() {
        location.reload();
    });
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            loggedIn();
        }else{
            $('#adminTabPanel').hide();
            $('#noPermission').show();
            $('#noPermission').append('Please Login To See Admin Dashboard');
        }
    });

};
function loggedIn(){
    FB.api('/me', function(response) {
        console.log('Good to see you, ' + response.name + '.');
        localStorage.setItem('USER_FB_INFO',JSON.stringify(response));

        fbUserName = response.username;
        $('#loggedUserDiv').html(response.username);
        if(fbUserName === 'pram.gottiganti' || fbUserName === 'ashwin.patti'){
            playingTeam();
            $('#noPermission').hide();
        }else{
            $('#allTeamsDiv').hide();
            $('#noPermission').show();
        }
    });
}

function playingTeam()
{
    $.get("http://www.dukesxi.co/ipl/players",function(data,status){
       var player = data.results;
        var teamtablehtml='<table id="teamTable"><thead><tr>' +
            '<th>ID</th>' +
            '<th>Name</th>' +
            '<th>Team</th>' +
            '<th>ObjectId</th>' +
            '<th>MOM</th>' +
            '</tr></thead>';
        $.each(player,function (){
        {

            teamtablehtml+='<tr><td>'+this.ID+'</td>' +
                '<tr><td>'+this.Name+'</td>'+
                '<tr><td>'+this.Team+'</td>'+
                '<tr><td>'+this.objectId+'</td>'+
                '<td><input type="checkbox" id="'+this.ID+'IsMoM"></td></tr>';
        }
        teamtablehtml+='</table>';
        teamtablehtml+='<input type="button" id="submitpoints" value="Submit"/>'
        $('#iplScoreSheetDiv').html(teamtablehtml);

       /* $('#submitpoints').click(function()
        {
            var teamtable = document.getElementById("teamTable");
            var teamJson=[];
            for(var i=1;i<teamtable.rows.length;i++)
            {
                var playerJson={};
                playerJson.player=teamtable.rows[i].cells[0].innerHTML;
                playerJson.battingRuns=parseInt(teamtable.rows[i].cells[1].children[0].value);
                playerJson.battingBalls=parseInt(teamtable.rows[i].cells[2].children[0].value);
                playerJson.notOut=document.getElementById(playerJson.player+"notOut").checked;
                playerJson.bowlingWickets=parseInt(teamtable.rows[i].cells[4].children[0].value);
                playerJson.bowlingExtras=parseInt(teamtable.rows[i].cells[5].children[0].value);
                playerJson.bowlingMaidenOvers=parseInt(teamtable.rows[i].cells[6].children[0].value);
                playerJson.bowlingEconomy=parseInt(teamtable.rows[i].cells[7].children[0].value);
                playerJson.fieldingCatches=parseInt(teamtable.rows[i].cells[8].children[0].value);
                playerJson.fieldingStumping=parseInt(teamtable.rows[i].cells[9].children[0].value);
                playerJson.fieldingRunOut=parseInt(teamtable.rows[i].cells[10].children[0].value);
                playerJson.IsMoM=document.getElementById(playerJson.player+"IsMoM").checked;
                teamJson.push(playerJson);
            }*/

            $.ajax({
                type: "PUT",
                contentType:'application/json',
                url: '/fantasyscore/'+pollid,
                data: JSON.stringify(teamJson),
                dataType: 'json',
                success: function(msg) {
                    alert("Points updated");
                    location.href="/";
                }
            });
        });

    });
}
