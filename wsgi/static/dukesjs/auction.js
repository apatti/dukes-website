var fbUserName='';
var DOMAIN_NAME = 'http://www.dukesxi.co';
var currentBalance=0;
var allTeamPlayers='';
var iplPlayer='';
var playerType = '';
var bidInitiator ='';
var maxbid=0;
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
		 fbUserName = response.username;
		 $('#loggedUserDiv').html(response.username);
         init();
		 showAvailableIPLplayers();
		 startAuction();
		});

 }
 
 

function startAuction() {
  var socket;
    $(function(){
         socket =io.connect('http://auction-dukesxi.rhcloud.com:8000');
         socket.on('timer',function(content){
            $('#timer').text(content.timer);
			$('#btn_bidSubmit').removeAttr("disabled");
			$('#btn_cancelSubmit').removeAttr("disabled");
			$('#btn_1').removeAttr("disabled");
			 
         });
         socket.on('biddata',function(content){
             $('#currentBidAmount').text(content.bidAmount);
             $('#currentBidder').text(content.user);
             $("#bidAmmountTxt").val(parseInt(content.bidAmount)+1);
			 var pDetails = sessionStorage.getItem(content.iplPlayer);
			 var tt = pDetails.split('%');
			$('#currentIPLPlayerDiv').html(tt[0]);
			$('#currentIPLPlayerTypeDiv').html(tt[1]);
             iplPlayer = content.iplPlayer;
			  
         });
        socket.on('bidcomplete',function(content){
            var pDetails = sessionStorage.getItem(content.iplPlayer);
			var tt = pDetails.split('%');
            $('#solddiv').html(tt[0]+" ("+tt[1] +") sold to "+content.user+" for $"+content.bidAmount);
            $( ".userdialog" ).dialog({
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
            $('#solddialog').dialog("open");

            init();
        });
        socket.on('bidreset',function(content){
            init();
            $('#currentBidder').text('');
            $('#timer').text('0');
        });
    });

    $('#btn_bidSubmit').click( function(){
		//this should be called only once by whoever has got the turn.
        var oldbid=$("#currentBidAmount").text();
        var bid=$("#bidAmmountTxt").val();
        console.log("Old Amount " + oldbid);
        console.log("Current Amount "+ bid);
        var user=fbUserName;
        if(bid <= 0){
            return;
        }
       if(iplPlayer === null || iplPlayer ===''){
            alert("Please Select Player");
            return;
        }
        socket.emit("bidstart", {"iplPlayer": iplPlayer});

		if(parseInt(oldbid) < parseInt(bid)) {
            if(parseInt(bid) > parseInt(maxbid) ) {
                alert("Bid mount should not be more than : "+maxbid);
            }else{
                socket.emit("bidentry",{"oldBidAmount":parseInt(oldbid),"newBidAmount":parseInt(bid),"user":user});
            }
        }
		//--------------------

    });
    if(fbUserName === 'pram.gottiganti' || fbUserName === 'ashwin.patti') {
        /*$('#btn_cancelSubmit').click(function () {
            socket.emit("bidreset");
            $('#currentBidAmount').text('0');
            $('currentBidder').text('');
        });*/
    }

}

 $(function(){
	$('#btn_1').click( function(){
	
		var bid=$("#bidAmmountTxt").val();
		$("#bidAmmountTxt").val(parseInt(bid)+1);
		//updateTeams(); 
	});
	$("#iplTeamsDropDown").change(function(){
            var teamId=$(this).children(":selected").attr("id");
            selectTeam(teamId);
        });

});
	function init(){
        $.get(DOMAIN_NAME+"/ipl/users",function(data,status){
            var dd = data.results;
			allTeamPlayers = dd;

             var allOwnerDivs ='';
            console.log(dd);
			var bidButtonEnabled = false;
            $.each(dd,function (){
                                   
				var imgUrl = 'https://graph.facebook.com/'+this.username+'/picture?type=normal';
                if(this.iscurrentplayer){

                    allOwnerDivs = allOwnerDivs + '<div id="'+(this.username).replace(/\./g, '_')+'" class="iplOwner" style="background:darkorchid;">';
                } else{
                    allOwnerDivs = allOwnerDivs + '<div id="'+(this.username).replace(/\./g, '_')+'" class="iplOwner" style="background:cornsilk;">';
                }

				allOwnerDivs = allOwnerDivs + '<a href="javascript:void(0);" ><div class="ownerImg"><img src="'+ imgUrl +'"  class="image" width="80px" height="75px"/></div>';
				allOwnerDivs = allOwnerDivs + '<div class="ownerName">'+this.firstname+'</div>';
				allOwnerDivs = allOwnerDivs + '<div id="'+this.username+'ownerAmount" class="ownerAmount" style="font-size: medium;font-weight: 800;color: darkred;">$'+this.balance+'</div>';

				allOwnerDivs = allOwnerDivs+'</a></div>';
               
                /*$("#iplTeamsDropDown").append('<option id='+this.username+'>'+this.firstname+'</option>');*/

				//Enable Bid button only for currentPlayer
				if(! bidButtonEnabled){
					if( this.iscurrentplayer && this.username === fbUserName){						
						$('#btn_bidSubmit').removeAttr("disabled");
						$('#btn_cancelSubmit').removeAttr("disabled");
						$('#btn_1').removeAttr("disabled");
                        bidInitiator  = this.username;
                        bidButtonEnabled = true;

					}else{
						$('#btn_bidSubmit').attr("disabled", "disabled");
						$('#btn_cancelSubmit').attr("disabled", "disabled");
						$('#btn_1').attr("disabled", "disabled");
					}
				}
				if(this.username === fbUserName){
					currentBalance = this.balance;
                    maxbid = currentBalance-(9-this.playercount)+1;
				}


            });
            $('#ownersDiv').html(allOwnerDivs);
            $('#currentBidAmount').text('0');
            $('currentBidder').text('');
            $("#bidAmmountTxt").val(1);
            /*if(bidInitiator === fbUserName){
                $('#'+(fbUserName).replace(/\./g, '_')).css({ backgroundColor: 'green' });
            }*/
            $('.iplOwner').click(function (){
                $('#teamsDiv').find('span.ui-panel-title').text((this.id).replace(/\_/g, '.'));
                selectTeam((this.id).replace(/\_/g, '.'));
            });
        });
		
	}
	
	function selectTeam(userName){

		$.get(DOMAIN_NAME+"/ipl/userteams/"+userName,function(data,status){
            var team=new Object;
            team.bat1=null;
            team.bat2=null;
            team.bowl1=null;
            team.bowl2=null;
            team.all1=null;
            team.all2=null;
            team.keep=null;
            team.filler1=null;
            team.filler2=null;
            players = $.parseJSON(JSON.stringify(data));
            var batsman=jQuery.grep(players.results,function(iplplayer,index){
                if(iplplayer.Type.toLowerCase().indexOf('batsman')!=-1)
                    return true;
            });


            var bowlers=jQuery.grep(players.results,function(iplplayer,index){
                if(iplplayer.Type.toLowerCase().indexOf('bowler')!=-1)
                    return true;
            });
            var allrounders=jQuery.grep(players.results,function(iplplayer,index){
                if(iplplayer.Type.toLowerCase().indexOf('all-rounder')!=-1)
                    return true;
            });
            var keepers=jQuery.grep(players.results,function(iplplayer,index){
                if(iplplayer.Type.toLowerCase().indexOf('wicket keeper')!=-1)
                    return true;
            });
            var fillerindex=0;
            for(var i=0;i<batsman.length;i++)
            {
                if(i<2)
                {
                    team["bat"+(i+1)]=batsman[i];
                }
                else
                {
                    team["filler"+(fillerindex+1)]=batsman[i];
                    fillerindex++;
                }
            }
            for(var i=0;i<bowlers.length;i++)
            {
                if(i<2)
                {
                    team["bowl"+(i+1)]=bowlers[i];
                }
                else
                {
                    team["filler"+(fillerindex+1)]=batsman[i];
                    fillerindex++;
                }
            }
            for(var i=0;i<allrounders.length;i++)
            {
                if(i<2)
                {
                    team["all"+(i+1)]=allrounders[i];
                }
                else
                {
                    team["filler"+(fillerindex+1)]=allrounders[i];
                    fillerindex++;
                }
            }
            for(var i=0;i<keepers.length;i++)
            {
                if(i<1)
                {
                    team["keep"+(i+1)]=batsman[i];
                }
                else
                {
                    team["filler"+(fillerindex+1)]=keepers[i];
                    fillerindex++;
                }
            }

            google.load('visualization','1.0',{'packages':['table'],callback:drawTable});
            function drawTable()
            {
                var datarow = new google.visualization.DataTable();
                datarow.addColumn('string','Role');
                datarow.addColumn('string','Player');
                datarow.addColumn('number','$');

                if(team.keep!=null)
                    {
                        datarow.addRows([["Wicket Keeper",team.keep.Name+", "+team.keep.Team,team.keep.price]]);
                    }
                    else
                    {
                        datarow.addRows([["Wicket Keeper","",0]]);
                    }

                for(var i=0;i<2;i++)
                {
                    if(team["bat"+(i+1)]!=null)
                    {
                        datarow.addRows([[team["bat"+(i+1)].Type,team["bat"+(i+1)].Name+", "+team["bat"+(i+1)].Team,team["bat"+(i+1)].price]]);
                    }
                    else
                    {
                        datarow.addRows([["Batsman","",0]]);
                    }
                }
                for(var i=0;i<2;i++)
                {
                    if(team["bowl"+(i+1)]!=null)
                    {
                        datarow.addRows([[team["bowl"+(i+1)].Type,team["bowl"+(i+1)].Name+", "+team["bowl"+(i+1)].Team,team["bowl"+(i+1)].price]]);
                    }
                    else
                    {
                        datarow.addRows([["Bowler","",0]]);
                    }
                }
                for(var i=0;i<2;i++)
                {
                    if(team["all"+(i+1)]!=null)
                    {
                        datarow.addRows([[team["all"+(i+1)].Type,team["all"+(i+1)].Name+", "+team["all"+(i+1)].Team,team["all"+(i+1)].price]]);
                    }
                    else
                    {
                        datarow.addRows([["All-Rounder","",0]]);
                    }
                }
                for(var i=0;i<2;i++)
                {
                    if(team["filler"+(i+1)]!=null)
                    {
                        datarow.addRows([[team["filler"+(i+1)].Type,team["filler"+(i+1)].Name+", "+team["filler"+(i+1)].Team,team["filler"+(i+1)].price]]);
                    }
                    else
                    {
                        datarow.addRows([["Filler","",0]]);
                    }
                }

                var availableIPLPlayerstable = new google.visualization.Table(document.getElementById('iplTeamDiv'));
                var options = {'height': 300};
                availableIPLPlayerstable.draw(datarow,options);
            }


        });
	}

function updateIPlFantasyTeams(){

}
	
	// Show All Available IPL Players
function showAvailableIPLplayers()
{
    $.get("http://www.dukesxi.co/ipl/players",function(data,status){
        players = $.parseJSON(JSON.stringify(data));		
        google.load('visualization','1.0',{'packages':['table'],callback:drawTable});
        function drawTable()
        {
            var datarow = new google.visualization.DataTable();
			//datarow.addColumn('number','ID');
			datarow.addColumn('string','Type');
		    datarow.addColumn('string','Player');
            datarow.addColumn('string','Team');
			datarow.addColumn('string','Obj');


		    for (var i=0;i<players.results.length;i++)
			{
				//var id = players.results[i].ID;
			    var playerName = players.results[i].Name;
				var palyerType = players.results[i].Type;
				var objId = players.results[i].objectId;
                var teamName  =	players.results[i].Team;
				sessionStorage.setItem(objId,playerName+'%'+palyerType);

			    var type='';
				if( palyerType ==='Bowler'){
					type ='BOW';
				}else if(palyerType ==='All-Rounder'){
					type ='ALL';
				}else if(palyerType ==='Wicket Keeper'){
					type ='KEEP';
				}else if(palyerType ==='Batsman'){
					type ='BAT';
				}
		  	    datarow.addRows([[type,playerName,teamName,objId]]);
			}
            var availableIPLPlayerstable = new google.visualization.Table(document.getElementById('iplPlayersDiv'));
			var options = {'height': 300};
		    availableIPLPlayerstable.draw(datarow,options);
			google.visualization.events.addListener(availableIPLPlayerstable, 'select', function() {
				var selection = availableIPLPlayerstable.getSelection();
				if(bidInitiator === fbUserName) {
                        var message = '';
                        for (var i = 0; i < selection.length; i++) {
                            var item = selection[i];
                            iplPlayer = datarow.getFormattedValue(item.row, 3);
                            $('#currentIPLPlayerDiv').html(datarow.getFormattedValue(item.row, 1));
                            var palyerType = datarow.getFormattedValue(item.row, 2);
                            var type = '';
                            if (palyerType === 'BOW') {
                                type = 'Bowler';
                            } else if (palyerType === 'ALL') {
                                type = 'All-Rounder';
                            } else if (palyerType === 'KEEP') {
                                type = 'Wicket Keeper';
                            } else if (palyerType === 'BAT') {
                                type = 'Batsman';
                            }
                            $('#currentIPLPlayerTypeDiv').html(type);
                            $('#currentBidAmount').text('0');
                            $('currentBidder').text('');
                        }
                    }
				});
			}

    });
}