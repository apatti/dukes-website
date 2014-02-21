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
	   $('#pollCreationDiv').append('Please Login To See Admin Dashboard');
	   location.reload();
		});
	FB.Event.subscribe('auth.login', function() {
		  location.reload();
	});
	 FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {		
			loggedIn();					
		}else{
			$('#pollCreationDiv').append('Please Login To See Admin Dashboard');
		}
	});
	
};
 function loggedIn(){
	 FB.api('/me', function(response) {
		  console.log('Good to see you, ' + response.name + '.');	  
		  localStorage.setItem('USER_FB_INFO',JSON.stringify(response));
		
		   fbUserName = response.username;
		   $('#loggedUserDiv').html(response.username);	 
		   if(fbUserName === 'pram.gottiganti' || fbUserName === 'ashwin.patti'){
				pollCreation();
		   }else{
				$('#pollCreationDiv').append('You dont have permissions to view Admin Dashboard');
		   }
		});
 }
 /*
	Poll Creation
 */
 function pollCreation(){
	$('#createNewPollBtn').click(function (){
		
		var pollSubj = $('#pollSubjectTxt').val();

		/*$('ul#pollOptionsUl').find('li').each(function(){
			options.push('{ "text":"'+$(this).text()+'"}');
		})
		*/
		
		var options = [];
			$('.allOptions').each(function(){	
						var jsonArg1 = new Object();
						jsonArg1.text = $(this).text();		
						options.push(jsonArg1);
					})
        var pollData={};
        pollData.username = fbUserName;
        pollData.closeMethod ='manual';
        pollData.question = pollSubj;
        pollData.options = options;

		var jsonArray = JSON.stringify(pollData); 
		alert(jsonArray);
        /*
		$.ajax({
			type: "POST",
			contentType:'application/json',
			url: '/polls',
			data: JSON.stringify({'username':fbUserName,'closeMethod':'manual','question':question,'endDate':'2014-01-28','options':JSON.stringify(jsonArray)}),
			dataType: 'json',
			success: function(msg) {
			   alert("New Poll Has been created");
			   location.href="/poll.html";
		   }
		});
		*/
	});
 }
 