/**
 * Created by gunni on 4/15/2014.
 */
/**
 * Created by apatti on 4/2/14.
 */
/**
 * Created by apatti on 3/6/14.
 */


$(function (){
    $('#selectTeamDRopDown').change(function(){
        var teamID=$(this).children(":selected").attr("id");

        if(teamID!='')
        {
            playingTeam(teamID);
        }
    });
});

function playingTeam( teamName)
{
    $.get("http://www.dukesxi.co/ipl/players/team/"+teamName,function(data,status){
       var player = data.results;
        var teamtablehtml='<table id="teamTable"><thead><tr>' +
            '<th style="display:none;">key</th>' +
            '<th>Name</th>' +
            '<th>Runs</th>' +
            '<th>Sixs</th>' +
            '<th>Batsman Balls</th>' +
            '<th>Wickets</th>' +
            '<th>Maiden</th>' +
            '<th>Bowling Runs</th>' +
            '<th>Bowling Balls</th>' +
            '<th>Catches</th>' +
            '<th>Stumps</th>' +
            '<th>Direct Run out</th>' +
            '<th>Run Out</th>' +
            '<th>MOM</th>' +
            '<th>Winner</th>' +
            '</tr></thead>';
        $.each(player,function (){

            teamtablehtml+='<tr><td style="display:none;">'+this.ID+'-'+this.objectId+'-'+this.Team+'-'+this.owner1+'-'+this.owner2+'</td>' +
                '<td>'+this.Name+'</td>'+
                '<td><input type="number" id="'+this.Name+'runs" value=0></td>' +
                '<td><input type="number" id="'+this.Name+'sixa" value=0></td>' +
                '<td><input type="number" id="'+this.Name+'strikeRate" value=0></td>' +
                '<td><input type="number" id="'+this.Name+'wickets" value=0></td>' +
                '<td><input type="number" id="'+this.Name+'maiden" value=0></td>' +
                '<td><input type="text" id="'+this.Name+'runRate" value=0></td>' +
                '<td><input type="number" id="'+this.Name+'noOfBalls" value=0></td>' +
                '<td><input type="number" id="'+this.Name+'catches" value=0></td>' +
                '<td><input type="number" id="'+this.Name+'stumps" value=0></td>' +
                '<td><input type="number" id="'+this.Name+'directRunOut" value=0></td>' +
                '<td><input type="number" id="'+this.Name+'runOut" value=0></td>' +
                '<td><input type="checkbox" id="'+this.objectId+'IsMoM"></td>' +
                '<td><input type="checkbox" id="'+this.objectId+'IsWinner"></td></tr>';
        });
        teamtablehtml+='</table>';
        teamtablehtml+='<input type="button" id="submitpoints" value="Submit"/>'
        $('#iplScoreSheetDiv').html(teamtablehtml);

       $('#submitpoints').click(function() {
           var teamtable = document.getElementById("teamTable");
           var teamJson = [];
           for (var i = 1; i < teamtable.rows.length; i++) {
               var keyStr = (teamtable.rows[i].cells[0].innerHTML).split('-');

               var playerJson = {};
               playerJson.ID = keyStr[0];
               playerJson.objectId = keyStr[1];
               playerJson.Team = keyStr[2];
               playerJson.owner1 = keyStr[3];
               playerJson.owner2 = keyStr[4];
               playerJson.Name = teamtable.rows[i].cells[1].innerHTML;
               playerJson.battingRuns = parseInt(teamtable.rows[i].cells[2].children[0].value);
               playerJson.sixs = parseInt(teamtable.rows[i].cells[3].children[0].value);
               playerJson.battingBalls = parseInt(teamtable.rows[i].cells[4].children[0].value);//document.getElementById(playerJson.player+"notOut").checked;
               playerJson.bowlingWickets = parseInt(teamtable.rows[i].cells[5].children[0].value);
               playerJson.bowlingMaidenOvers = parseInt(teamtable.rows[i].cells[6].children[0].value);
               playerJson.bowlingRuns = parseFloat(teamtable.rows[i].cells[7].children[0].value);
               playerJson.noOfBalls = parseInt(teamtable.rows[i].cells[8].children[0].value);
               playerJson.fieldingCatches = parseInt(teamtable.rows[i].cells[9].children[0].value);
               playerJson.fieldingStumping = parseInt(teamtable.rows[i].cells[10].children[0].value);
               playerJson.directRunOut = parseInt(teamtable.rows[i].cells[11].children[0].value);
               playerJson.fieldingRunOut = parseInt(teamtable.rows[i].cells[12].children[0].value);
               playerJson.IsMoM = document.getElementById(playerJson.objectId + "IsMoM").checked;
               playerJson.IsWinner = document.getElementById(playerJson.objectId + "IsWinner").checked;
               teamJson.push(playerJson);
           }

           $.ajax({
                type: "POST",
                contentType:'application/json',
                url: '/ipl/games/score',
                data: JSON.stringify(teamJson),
                dataType: 'json',
                success: function(msg) {
                    alert("Points updated");
                    location.href="/";
                }
            });
           //alert(JSON.stringify(teamJson));
       });

           /* $.ajax({
                type: "PUT",
                contentType:'application/json',
                url: '/fantasyscore/'+pollid,
                data: JSON.stringify(teamJson),
                dataType: 'json',
                success: function(msg) {
                    alert("Points updated");
                    location.href="/";
                }
            });*/
        });

}
