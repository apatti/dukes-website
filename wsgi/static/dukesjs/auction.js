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
		});

 }
 
 
	function polling(){
        $.get(DOMAIN_NAME+"/ipl/users",function(data,status){
            var dd = data.results;
            var allOwnerDivs ='';
            console.log(dd);
            $.each(dd,function (){
                if(  this.username != 'rupesh.kunnath'){
                    console.log(this.username);
                    var imgUrl = 'https://graph.facebook.com/'+this.username+'/picture?type=normal';
                    allOwnerDivs = allOwnerDivs + '<div id="'+this.username+'" class="iplOwner">';
                    allOwnerDivs = allOwnerDivs + '<div class="ownerImg"><img src="'+ imgUrl +'"  class="image" width="55px" height="60px"/></div>';
                    allOwnerDivs = allOwnerDivs+'</div>';
                }

            });
            $('#ownersDiv').append(allOwnerDivs);
        });

	}
	
