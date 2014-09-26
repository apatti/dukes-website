$(document).ready(function(){
	 $('#dukesLoginDiv').html("<div id='signinButton'>"+
  "<span class='g-signin' " +
    "data-callback='googleSigninCallback'"+
    "data-clientid='319656721002-ppajmfotulboinl39ic9vq19ql60m0nq.apps.googleusercontent.com'"+
    "data-cookiepolicy='single_host_origin'"+
    "data-scope='email'"+
    "data-width='200'"+
    "data-height='short'>"+
    "</span></div>");
 });

  // Load the SDK asynchronously
  (function(d){
   var po = d.createElement('script');
   po.type = 'text/javascript';
   po.async = true;
   po.src = 'https://apis.google.com/js/client:plusone.js';
   var s = d.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  }(document));

    function googleSigninCallback(authResult){
        if(authResult['access_token'])
        {
            gapi.client.load('plus','v1',function(){
                gapi.client.plus.people.get({userId:'me'}).execute(function(resp){
                    var primaryEmail='';
                    for(var i=0;i<resp.emails.length;i++)
                    {
                        if(resp.emails[i].type==='account')
                        {
                            primaryEmail=resp.emails[i].value;
                            $('#dukesLoginDiv').html(primaryEmail);
                            localStorage.setItem('USER_GOOGLE_INFO',JSON.stringify(resp));
                            break;
                        }
                    }
                });
            });
        }
        else
        {
            alert("Not logged in");
        }
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
