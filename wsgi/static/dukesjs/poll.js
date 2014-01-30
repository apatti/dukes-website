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
	   $('#pollsDiv').append('Please Login To See Poll');
	   location.reload();
		});
	FB.Event.subscribe('auth.login', function() {
		  location.reload();
	});
	 FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {			
			polling();
		}else{
			$('#pollsDiv').append('Please Login To See Poll');
		}
	});
	
};
	function polling(){
		var pollTableStr = '<table>';
		
		$.get("http://www.dukesxi.co/polls",function(data,status){
				var rr = JSON.stringify(data.results);	
				alert(rr);
				 var pData = $.parseJSON(rr);
				$.each(pData, function() {	
					alert(this['closeMethod']);
					});
			});
		}

				$("#userNameDiv").html("<h3>"+userData['name']+"</br> </h3>");
				$("#userImgDiv").html("<img  src='https://graph.facebook.com/"+userData['username']+"/picture?type=normal'  class='image' width='75px' height='75px'/>");
				
	});
	}
 