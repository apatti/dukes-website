 $(document).ready(function(){
	 $('#dukesLoginDiv').html("<div id='googleSigninButton'>"+
  "<span class='g-signin' " +
    "data-callback='signinCallback'"+
    "data-clientid='CLIENT_ID'"+
    "data-cookiepolicy='single_host_origin'"+
    "data-requestvisibleactions='http://schema.org/AddAction'"+
    "data-scope='https://www.googleapis.com/auth/plus.login'>"+
  "</span></div>"+
  "<div id='fb-root'><fb:login-button autologoutlink='true' width='200' max-rows='1'></fb:login-button></div>");

 });