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
	$('#loggedUserDiv').html("");
	});
	FB.Event.subscribe('auth.login', function() {
	  location.reload();
	});
	
  // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
  // for any authentication related change, such as login, logout or session refresh. This means that
  // whenever someone who was previously logged out tries to log in again, the correct case below 
  // will be handled. 
  FB.Event.subscribe('auth.authResponseChange', function(response) {
    // Here we specify what we do with the response anytime this event occurs. 
    if (response.status === 'connected') {
      // The response object is returned with a status field that lets the app know the current
      // login status of the person. In this case, we're handling the situation where they 
      // have logged in to the app.
      loginSuccessAPI();
    } else if (response.status === 'not_authorized') {
      // In this case, the person is logged into Facebook, but not into the app, so we call
      // FB.login() to prompt them to do so. 
      // In real-life usage, you wouldn't want to immediately prompt someone to login 
      // like this, for two reasons:
      // (1) JavaScript created popup windows are blocked by most browsers unless they 
      // result from direct interaction from people using the app (such as a mouse click)
      // (2) it is a bad experience to be continually prompted to login upon page load.
	  
	  localStorage.setItem('USER_FB_INFO',false);
      //FB.login();
    } else {
      // In this case, the person is not logged into Facebook, so we call the login() 
      // function to prompt them to do so. Note that at this stage there is no indication
      // of whether they are logged into the app. If they aren't then they'll see the Login
      // dialog right after they log in to Facebook. 
      // The same caveats as above apply to the FB.login() call here.
	
	   localStorage.setItem('USER_FB_INFO',false);	  
		  //FB.login();
    }
  });
  };
  
  // Load the SDK asynchronously
  (function(d){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all.js";
   ref.parentNode.insertBefore(js, ref);
   var po = document.createElement('script');
   po.type = 'text/javascript';
   po.async = true;
   po.src = 'https://apis.google.com/js/client:plusone.js';
   var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  }(document));

  // Here we run a very simple test of the Graph API after login is successful. 
  // This testAPI() function is only called in those cases. 
  function loginSuccessAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Good to see you, ' + response.name + '.');	  
      localStorage.setItem('USER_FB_INFO',JSON.stringify(response));
	
	   fbUserName = response.username;
	   $('#loggedUserDiv').html(response.username);
	   //Post FB data to dukes service
	   var jsonObj ='';
	   var dataTobesent ={ 'name':response.name,'first_name': response.first_name,'last_name':response.last_name, 'username':response.username,'fb_id':response.id,'link':response.link,'tca_id':'','email':''} ;
	   //alert(JSON.stringify(dataTobesent));
	   $.ajax({
			  type: 'POST',
			  url: DOMAIN_NAME +'/users/',
			  dataType: 'json',
			  contentType:'application/json',
			  data:JSON.stringify(dataTobesent),			  
			  success: function(res,status,jqXHR){
				jsonObj = JSON.stringify(res.result.results[0]);
				localStorage.setItem('USER_FB_INFO',jsonObj);			
			  },
			  error: function(jqXHR, textStatus, errorThrown){
                    alert(textStatus, errorThrown);
                }
			 
			});
});
    
  }
