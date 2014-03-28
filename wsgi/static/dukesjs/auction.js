var fbUserName='';
var DOMAIN_NAME = 'http://www.dukesxi.co';
var currentBalance=0;
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
         polling();
		 showAvailableIPLplayers();
		 startAuction();
		});

 }
 
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
			
		    for (var i=0;i<players.results.length;i++)
			{
				var id = players.results[i].ID;
			    var plsyerName = players.results[i].Name;
				var palyerType = players.results[i].Type;
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
		  	    datarow.addRows([[id,plsyerName,type]]);
			}
            var availableIPLPlayerstable = new google.visualization.Table(document.getElementById('iplPlayersDiv'));
			var options = {'height': 300};
		    availableIPLPlayerstable.draw(datarow,options);
			google.visualization.events.addListener(availableIPLPlayerstable, 'select', function() {
				var selection = availableIPLPlayerstable.getSelection();
				
				var message = '';
				  for (var i = 0; i < selection.length; i++) {
					var item = selection[i];
					$('#currentIPLPlayerDiv').html(datarow.getFormattedValue(item.row, 1));
					var palyerType = datarow.getFormattedValue(item.row, 2);
					var type ='';
					if( palyerType ==='BOW'){
							type ='Bowler';
						}else if(palyerType ==='ALL'){
							type ='All-Rounder';
						}else if(palyerType ==='KEEP'){
							type ='Wicket Keeper';
						}else if(palyerType ==='BAT'){
							type ='Batsman';
						}
					$('#currentIPLPlayerTypeDiv').html(type);
					/*if (item.row != null && item.column != null) {
					  var str = datarow.getFormattedValue(item.row, item.column);
					  message += '{row:' + item.row + ',column:' + item.column + '} = ' + str + '\n';
					} else if (item.row != null) {
					  var str = datarow.getFormattedValue(item.row, 0);
					  message += '{row:' + item.row + ', (no column, showing first)} = ' + str + '\n';
					} else if (item.column != null) {
					  var str = datarow.getFormattedValue(0, item.column);
					  message += '{(no row, showing first), column:' + item.column + '} = ' + str + '\n';
					} */
				  }				  
				});
			}

    });
}

function startAuction() {
  var socket;
    $(function(){
         socket =io.connect('http://auction-dukesxi.rhcloud.com:8000');
         socket.on('timer',function(content){
             $('#timer').text(content.timer);
         });
         socket.on('biddata',function(content){
             $('#currentBidAmount').text(content.bidAmount);
             $('#currentBidder').text(content.user);
         });
    });

    $('#btn_bidSubmit').click( function(){
		
        socket.emit("bidstart");
        var oldbid=$("#currentBidAmount").text();
        var bid=$("#bidAmmountTxt").val();
        var user=fbUserName;
        socket.emit("bidentry",{"oldBidAmount":parseInt(oldbid),"newBidAmount":parseInt(bid),"user":user});
    });

}

 $(function(){
	$('#btn_1').click( function(){
		updateTeams(); 
	});
});
	function polling(){
        $.get(DOMAIN_NAME+"/ipl/users",function(data,status){
            var dd = data.results;
            var allOwnerDivs ='';
            console.log(dd);
            $.each(dd,function (){
                                   
				var imgUrl = 'https://graph.facebook.com/'+this.username+'/picture?type=normal';
				allOwnerDivs = allOwnerDivs + '<div id="'+this.username+'" class="iplOwner">';
				allOwnerDivs = allOwnerDivs + '<div class="ownerImg"><img src="'+ imgUrl +'"  class="image" width="80px" height="75px"/></div>';
				allOwnerDivs = allOwnerDivs + '<div class="ownerName">'+this.firstname+'</div>';
				allOwnerDivs = allOwnerDivs + '<div id="'+this.username+'ownerAmount" class="ownerAmount">$'+this.balance+'</div>';

				allOwnerDivs = allOwnerDivs+'</div>';
               
                $("#iplTeamsDropDown").append('<option value="">'+this.firstname+'</option>');
							
            });
            $('#ownersDiv').append(allOwnerDivs);
        });
		
	}
	
	function updateTeams(){
		$.get(DOMAIN_NAME+"/ipl/users",function(data,status){
            var dd = data.results;			
            $.each(dd,function (){   
				var currentUser='narashan'	
				var bal = 89;//this.balance;
				$('#'+currentUser+'ownerAmount').html('$'+bal);//this.balance);
				$('#'+currentUser).css('background','green');				
            });
           
        });
	}
	
