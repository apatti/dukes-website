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
		   if(fbUserName === 'pram.gottiganti' || fbUserName === 'ashwin.patti' || fbUserName === 'surendra.batchu'){
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
    $.get("http://www.dukesxi.co/playingteam",function(data,status){
        var pollid= data.team.results[0].pollid;
        var team = data.team.results[0].team;

        /*
         * Sort according to the skill set.
         */
        team.sort(function(first,second){

            //name sort

            var firstskill=first.substr(first.indexOf('(')+1,2);
            var secondskill=second.substr(second.indexOf('(')+1,2);
            if(firstskill==secondskill)
            {
                if(first==second)
                    return 0;
                if(first<second)
                    return -1;
                else
                    return 1
            }
            if(firstskill<secondskill)
                return -1;
            if(firstskill>secondskill)
                return 1;
        });
        for(var index=0;index<team.length;index++)
        {
            $("#availableplayers").append('<tr><td><input type="checkbox" name="playing" value="'+team[index]+'">'+team[index]+'</td></tr>')
        }

        $("#submitteam").click(function()
        {
            var teamName=$("#teamname").val()
            if(teamName=='')
            {
                alert("Enter team name!!");
                return;
            }

            //TODO: Complete the functionality
            var fantasyTeam=$('input[name="playing"]:checkbox:checked').map(function(){
                return $(this).val();
            }).get();
            if(fantasyTeam.length!=7)
            {
                alert("Please select 7 players!!");
                return;
            }

            var bowlercount=jQuery.grep(fantasyTeam,function(user,index){
                if(user.toLowerCase().indexOf('bowler')!=-1)
                    return true;
            }).length;

            var batsmancount=jQuery.grep(fantasyTeam,function(user,index){
                if((user.toLowerCase().indexOf('batsman')!=1)||(user.toLowerCase().indexOf('keeper')!=-1))
                    return true;
            }).length;

            var allroundercount=jQuery.grep(fantasyTeam,function(user,index){
                if(user.toLowerCase().indexOf('allrounder')!=-1)
                    return true;
            }).length;

            if(bowlercount<2||batsmancount<2||allroundercount<1)
            {
                if(bowlercount<2)
                    alert("Please select at least 2 bowlers!!");
                if(batsmancount<2)
                    alert("Please select at least 2 batsman!!");
                if(allroundercount<1)
                    alert("Please select at least 1 allrounder!!");

                return;
            }

            var fantasyTeamobj={};
            fantasyTeamobj.pollid=pollid;
            fantasyTeamobj.team = fantasyTeam;
		    /*$.ajax({
			    type: "POST",
			    contentType:'application/json',
			    url: '/playingteam',
			    data: jsonObj,
			    dataType: 'json',
			    success: function(msg) {
			        alert("Team been submitted");
			        location.href="/";
		        }
		    });*/
        });
    });
}