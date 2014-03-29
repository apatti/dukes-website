var fbUserName='';
var DOMAIN_NAME = 'http://www.dukesxi.co';
var currentBalance=0;
var allTeamPlayers='';
var iplPlayer='';
var playerType = '';
var bidInitiator ='';
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
			 var pDetails = sessionStorage.getItem(content.iplPlayer);
			 var tt = pDetails.split('%');
			$('#currentIPLPlayerDiv').html(tt[0]);
			$('#currentIPLPlayerTypeDiv').html(tt[1]);
			  
         });
    });

    $('#btn_bidSubmit').click( function(){
		//this should be called only once by whoever has got the turn.
		
		socket.emit("bidstart",{"iplPlayer":iplPlayer});
		//--------------------
		
		var oldbid=$("#currentBidAmount").text();
        var bid=$("#bidAmmountTxt").val();
        var user=fbUserName;
		if(parseInt(bid) > currentBalance ) {
			alert("Bid mount should not be more than : "+currentBalance);
		}else{
			socket.emit("bidentry",{"oldBidAmount":parseInt(oldbid),"newBidAmount":parseInt(bid),"user":user});			
		}
        
        
    });

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
				allOwnerDivs = allOwnerDivs + '<div id="'+(this.username).replace(/\./g, '_')+'" class="iplOwner">';
				allOwnerDivs = allOwnerDivs + '<div class="ownerImg"><img src="'+ imgUrl +'"  class="image" width="80px" height="75px"/></div>';
				allOwnerDivs = allOwnerDivs + '<div class="ownerName">'+this.firstname+'</div>';
				allOwnerDivs = allOwnerDivs + '<div id="'+this.username+'ownerAmount" class="ownerAmount" style="font-size: medium;font-weight: 800;color: darkred;">$'+this.balance+'</div>';

				allOwnerDivs = allOwnerDivs+'</div>';
               
                $("#iplTeamsDropDown").append('<option id='+this.username+'>'+this.firstname+'</option>');

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
				}
				var team = this.team;
				if(team){
					$.each(team,function (){
						
					});
				}

            });
            $('#ownersDiv').append(allOwnerDivs);

            if(bidInitiator === fbUserName){
                $('#'+(fbUserName).replace(/\./g, '_')).css({ backgroundColor: 'green' });
            }
            $('.iplOwner').click(function (){
                alert(this.id);
                alert($(this).attr('id'));
            });
        });
		
	}
	
	function selectTeam(userName){
		alert("selected Team -> "+ userName);
		alert(allTeamPlayers);
	}
	function updateTeams(){

		/*$.get(DOMAIN_NAME+"/ipl/users",function(data,status){
            var dd = data.results;		
			allTeamPlayers = dd;
            $.each(dd,function (){   
				var currentUser='narashan'	
				var bal = 89;//this.balance;
				$('#'+currentUser+'ownerAmount').html('$'+bal);//this.balance);
				$('#'+currentUser).css('background','green');				
            });
           
        });*/
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
			datarow.addColumn('number','ID');
		    datarow.addColumn('string','Player');
			datarow.addColumn('string','Type');
			datarow.addColumn('string','Obj');


		    for (var i=0;i<players.results.length;i++)
			{
				var id = players.results[i].ID;
			    var playerName = players.results[i].Name;
				var palyerType = players.results[i].Type;
				var objId = players.results[i].objectId;
				
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
		  	    datarow.addRows([[id,playerName,type,objId]]);
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
                        }
                    }
				});
			}

    });
}