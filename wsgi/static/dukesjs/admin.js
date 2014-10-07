var userName='';
var DOMAIN_NAME = 'http://www.dukesxi.co';

$(document).bind('login_complete',loggedIn);
       
 function loggedIn(){
     var userData=$.parseJSON(localStorage.getItem('USER_GOOGLE_INFO'));
     $.get(DOMAIN_NAME+"/users/"+userData.id,function(data,status){
	     if(data.user.results[0].isAdmin==1)
		 {
		     userName=data.user.results[0].name;
		     pollCreation();
		     selectTeam();
		     $('#adminTabPanel').show();
		     $('#noPermission').hide();
		 }
	     else
		 {
		     $('#adminTabPanel').hide();
		     $('#noPermission').show();
		 }
	 })
	 .fail(function(){
		 $('#adminTabPanel').hide();
		 $('#noPermission').show();
	     });
 }

/*
 * Select Team
 */
function selectTeam()
{
    $.get("http://www.dukesxi.co/polls",function(data,status){
        var dd = $.parseJSON(data);
        var polldata={};
        $("#selectpoll").append('<option id="default">Select the poll</option>');
        $.each(dd,function()
        {
            if(this['isClosed']==1)
            {
                $("#selectpoll").append('<option id="'+this.objectId+'">'+this.question+'</option>');
                polldata[this.objectId]=this["options"];
            }
        });
        $("#selectpoll").change(function()
        {
            var pollid=$(this).children(":selected").attr("id");
            if(pollid!="default")
            {
                polldata[pollid][0].users.sort();
                polldata[pollid][1].users.sort();
                $.each(polldata[pollid],function()
                {
                   if(this['text']=='Available')
                   {
                       for(var index=0;index<this.users.length;index++)
                       {
                           $("#availableplayers").append('<tr><td><input type="checkbox" name="playing" value="'+this.users[index]+'">'+this.users[index]+'</td></tr>')
                       }
                   }
                });
            }
        });
        $("#submitteam").click(function()
        {
            var playingTeam=$('input[name="playing"]:checkbox:checked').map(function(){
                return $(this).val();
            }).get();
            if(playingTeam.length<11)
            {
                alert("Please select minimum 11 players!!");
                return;
            }
            var playingteamobj={};
            playingteamobj.pollid=$("#selectpoll").children(":selected").attr("id");
            playingteamobj.team = playingTeam;
            playingteamobj.ground=$("#groundaddress").val();
            if(playingteamobj.ground=='')
            {
                alert("Please enter the ground details!!");
                return;
            }
            playingteamobj.gamedate=$("#gamedate").val();
            playingteamobj.time=$("#time").val();
            if(playingteamobj.time=='')
            {
                alert("Please enter the time");
                return;
            }
            playingteamobj.message=$("#message").val();
            var jsonObj = JSON.stringify(playingteamobj);

		    $.ajax({
			    type: "POST",
			    contentType:'application/json',
			    url: '/playingteam',
			    data: jsonObj,
			    dataType: 'json',
			    success: function(msg) {
			        alert("Team been submitted");
			        location.href="/";
		        }
		    });
        });
    });
}


 /*
	Poll Creation
 */
 function pollCreation(){

     $('#resetAuctionBtn').click(function (){

     });
	$('#createNewPollBtn').click(function (){
		alert("Poll Creation");
		var pollSubj = $('#pollSubjectTxt').val();

		/*$('ul#pollOptionsUl').find('li').each(function(){
			options.push('{ "text":"'+$(this).text()+'"}');
		})
		*/
		
		var options = [];
			$('.allOptions').each(function(){	
						var jsonArg1 = new Object();
						jsonArg1.text = $(this).text();		
						options.push(jsonArg1);
					})
        var pollData={};
        pollData.username = userName;
        pollData.closeMethod ='manual';
        pollData.question = pollSubj;
        pollData.endDate = $("#datepicker").val();
        pollData.options = options;
	pollData.sendmailto=parseInt($("#sendmail").val());
		var jsonArray = JSON.stringify(pollData);

		$.ajax({
			type: "POST",
			contentType:'application/json',
			url: '/polls',
			data: jsonArray,
			dataType: 'json',
			success: function(msg) {
			   alert("New Poll Has been created");
			   location.href="/poll.html";
		   }
		});

	});
 }
 