 $(document).ready(function(){
	 $('#dukesLoginDiv').html("<div id='signinButton'>"+
  "<span class='g-signin' " +
    "data-callback='signinCallback'"+
    "data-clientid='319656721002-ppajmfotulboinl39ic9vq19ql60m0nq.apps.googleusercontent.com'"+
    "data-cookiepolicy='single_host_origin'"+
    "data-requestvisibleactions='http://schema.org/AddAction'"+
    "data-scope='https://www.googleapis.com/auth/plus.login'>"+
    "data-width='standard'"+
    "data-height='short'"+
    "</span><fb:login-button autologoutlink='true' width='200' max-rows='1'></fb:login-button></div>");

 });