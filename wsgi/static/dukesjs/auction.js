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
		});

 }
 
 function showAvailableIPLplayers()
{
    $.get("http://www.dukesxi.co/fantasyteam/MwcvuATX1T",function(data,status){
        players = $.parseJSON(data);
        google.load('visualization','1.0',{'packages':['table'],callback:drawTable});
        function drawTable()
        {
            var datarow = new google.visualization.DataTable();
		    datarow.addColumn('string','User');
		    datarow.addColumn('number','Points');
		    for (var i=0;i<players.results.length;i++)
			{
			    var username = players.results[i].user;
			    var points=players.results[i].points;
		  	    datarow.addRows([[username,points]]);
			}
            var availableIPLPlayerstable = new google.visualization.Table(document.getElementById('iplPlayersDiv'));
		    availableIPLPlayerstable.draw(datarow);
			google.visualization.events.addListener(availableIPLPlayerstable, 'select', function() {
				var selection = availableIPLPlayerstable.getSelection();
				selection = visualization.getSelection();
				var message = '';
				  for (var i = 0; i < selection.length; i++) {
					var item = selection[i];
					if (item.row != null && item.column != null) {
					  var str = data.getFormattedValue(item.row, item.column);
					  message += '{row:' + item.row + ',column:' + item.column + '} = ' + str + '\n';
					} else if (item.row != null) {
					  var str = data.getFormattedValue(item.row, 0);
					  message += '{row:' + item.row + ', (no column, showing first)} = ' + str + '\n';
					} else if (item.column != null) {
					  var str = data.getFormattedValue(0, item.column);
					  message += '{(no row, showing first), column:' + item.column + '} = ' + str + '\n';
					}
				  }
				  if (message == '') {
					message = 'nothing';
				  }
				  alert('You selected ' + message);
				});
			}

    });
}

function selectHandler() {
  
}

	function polling(){
        $.get(DOMAIN_NAME+"/ipl/users",function(data,status){
            var dd = data.results;
            var allOwnerDivs ='';
            console.log(dd);
            $.each(dd,function (){
                if(  this.username != 'rupesh.kunnath'){
                    console.log(this.username);
                    var firstName = this.username.split('.');
                    var imgUrl = 'https://graph.facebook.com/'+this.username+'/picture?type=normal';
                    allOwnerDivs = allOwnerDivs + '<div id="'+this.username+'" class="iplOwner">';
                    allOwnerDivs = allOwnerDivs + '<div class="ownerImg"><img src="'+ imgUrl +'"  class="image" width="80px" height="75px"/></div>';
                    allOwnerDivs = allOwnerDivs + '<div class="ownerName">'+firstName[0]+'</div>';
                    allOwnerDivs = allOwnerDivs + '<div class="ownerAmount"> Left $ 99</div>';

                    allOwnerDivs = allOwnerDivs+'</div>';
                }
                $("#iplTeamsDropDown").append('<option value="">'+this.username+'</option>');

            });
            $('#ownersDiv').append(allOwnerDivs);
        });

	}
	
