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
            $( "#datepicker" ).datepicker();
            $("#gamedate").datepicker();

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
		   if(fbUserName === 'pram.gottiganti' || fbUserName === 'ashwin.patti' || fbUserName === 'surendra.batchu'){
			    pollCreation();
                selectTeam();
               $('#adminTabPanel').show();
               $('#noPermission').hide();
		   }else{
               $('#adminTabPanel').hide();
				$('#noPermission').show();
		   }
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
        pollData.username = fbUserName;
        pollData.closeMethod ='manual';
        pollData.question = pollSubj;
        pollData.endDate = $("#datepicker").val();
        pollData.options = options;
	pollData.sendmailto=$("#sendmail").val();
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
 