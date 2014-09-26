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

		 FB.getLoginStatus(function(response) {
		  if (response.status === 'connected') {
			AuthStates.facebook=response;
              chooseAuthProvider();

		  } else if (response.status === 'not_authorized') {
			// the user is logged in to Facebook,
			// but has not authenticated your app
			localStorage.removeItem('USER_FB_INFO');
		  } else {
			// the user isn't logged in to Facebook.
			localStorage.removeItem('USER_FB_INFO');
		  }
		 });
		 applyCSSToPageComponents();
 };
var AuthStates = {
    google: null,
    facebook: null
  }

   $(document).ready(function(){
	 $('#dukesLoginDiv').html("<div id='signinButton'>"+
  "<span class='g-signin' " +
    "data-callback='signinCallback'"+
    "data-clientid='319656721002-ppajmfotulboinl39ic9vq19ql60m0nq.apps.googleusercontent.com'"+
    "data-cookiepolicy='single_host_origin'"+
    "data-requestvisibleactions='http://schema.org/AddAction'"+
    "data-scope='https://www.googleapis.com/auth/plus.login'"+
    "data-width='200'"+
    "data-height='short'>"+
    "</span></div><div id='fbroot'><fb:login-button autologoutlink='true' width='200' max-rows='1'></fb:login-button></div>");
 });

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

   function chooseAuthProvider()
   {
        if(AuthStates.google && AuthStates.facebook)
        {
            if(AuthStates.google['access_token'])
            {
                alert("Logged in with Google");
                $('#dukesLoginDiv').setAttribute('style', 'display: none');
            }
            else if (AuthStates.facebook.authResponse){
                alert("Logged in with FB");
                $('#dukesLoginDiv').setAttribute('style', 'display: none');
                loginFacebookSuccessAPI();
            }
            else
            {
                alert("Not logged in");
            }

        }
   }

    function signinCallback(authResult){
        AuthStates.google=authResult;
        chooseAuthProvider();
    }

  // Here we run a very simple test of the Graph API after login is successful. 
  // This testAPI() function is only called in those cases. 
  function loginFacebookSuccessAPI() {
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
