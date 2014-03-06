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
       $('#adminTabPanel').hide();
       $('#noPermission').show();
	   $('#noPermission').append('Please Login To See Admin Dashboard');

	   location.reload();
		});
	FB.Event.subscribe('auth.login', function() {
		  location.reload();
	});
	 FB.getLoginStatus(function(response) {
		if (response.status === 'connected') {		
			loggedIn();					
		}else{
            $('#adminTabPanel').hide();
            $('#noPermission').show();
			$('#noPermission').append('Please Login To See Admin Dashboard');
		}
	});
	
};
 function loggedIn(){
	 FB.api('/me', function(response) {
		  console.log('Good to see you, ' + response.name + '.');	  
		  localStorage.setItem('USER_FB_INFO',JSON.stringify(response));
		
		   fbUserName = response.username;
		   $('#loggedUserDiv').html(response.username);	 
		   if(fbUserName === 'pram.gottiganti' || fbUserName === 'ashwin.patti' || fbUserName === 'surendra.batchu'){
			    pollCreation();
                selectTeam();
               $('#adminTabPanel').show();
               $('#noPermission').hide();
		   }else{
               $('#adminTabPanel').hide();
				$('#noPermission').show();
		   }
		});
 }

/*
 * Select Team
 */
function selectTeam()
{
    $.get("http://www.dukesxi.co/polls",function(data,status){
        var dd = $.parseJSON(data);
        var polldata={};
        $("#selectpoll").append('<option id="default">Select the poll</option>');
        $.each(dd,function()
        {
            if(this['isClosed']==1)
            {
                $("#selectpoll").append('<option id="'+this.objectId+'">'+this.question+'</option>');
                polldata[this.objectId]=this["options"];
            }
        });
        $("#selectpoll").change(function()
        {
            alert(polldata[$(this).childen(":selected").attr("id")]);
            console.log(polldata[$(this).childen(":selected").attr("id")]);
        });
    });
}


 /*
	Poll Creation
 */
 function pollCreation(){
	$('#createNewPollBtn').click(function (){
		alert("Poll Creation");
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
        pollData.endDate = $("#datepicker").val();
        pollData.options = options;
	pollData.sendmailto=$("#sendmail").val();
		var jsonArray = JSON.stringify(pollData);

		$.ajax({
			type: "POST",
			contentType:'application/json',
			url: '/polls',
			data: jsonArray,
			dataType: 'json',
			success: function(msg) {
			   alert("New Poll Has been created");
			   location.href="/poll.html";
		   }
		});

	});
 }
 