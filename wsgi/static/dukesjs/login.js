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
                gapi.client.plus.people.get({userId:'me'}).execute(function(profile){
                    var primaryEmail='';
                    for(var i=0;i<profile.emails.length;i++)
                    {
                        if(profile.emails[i].type==='account')
                        {
                            primaryEmail=profile.emails[i].value;
                            var user_google_data={
                                name: profile.displayName,
                                id:profile.id,
                                username: profile.id,
                                imagelink:profile.image.url,
                                first_name:profile.name.givenName,
                                last_name:profile.name.familyName,
                                email: primaryEmail
                            };
                            $('#loggedUserDiv').html('<p>'+profile.displayName+'</p><p><a id="googleSignOut" href="#" onclick="onClickSignOut();return false;">signout</a></p>');
                            localStorage.setItem('USER_GOOGLE_INFO',JSON.stringify(user_google_data));
                            document.getElementById('dukesLoginDiv').setAttribute('style', 'display: none');
                            document.getElementById('loggedUserDiv').removeAttribute('style');
                            $('#loginerrorMsg').html("");
                            $(document).trigger('login_complete');
                            break;
                        }
                    }
                });
            });
        }
        else
        {
            $('#loginerrorMsg').html("<h3>Member Area, please login to access the page.</h3>");
        }
    }

  function onClickSignOut()
  {
      gapi.auth.signOut();
      localStorage.removeItem('USER_GOOGLE_INFO');
      document.getElementById('dukesLoginDiv').removeAttribute('style');
      document.getElementById('loggedUserDiv').setAttribute('style', 'display: none');
      $(document).trigger('logout_complete');
      location.href="/";
  }

