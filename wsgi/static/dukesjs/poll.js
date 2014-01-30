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
			loggedIn();					
		}else{
			$('#pollsDiv').append('Please Login To See Poll');
		}
	});
	
};
 function loggedIn(){
	 FB.api('/me', function(response) {
		  console.log('Good to see you, ' + response.name + '.');	  
		  localStorage.setItem('USER_FB_INFO',JSON.stringify(response));
		
		   fbUserName = response.username;
		   $('#loggedUserDiv').html(response.username);	 
		   polling();
		});
 }
	function polling(){
		var pollDivStr ='';
		$.get(DOMAIN_NAME+"/polls",function(data,status){
				
				var rr = JSON.stringify(data.results);	
				var pData = $.parseJSON(rr);
				var noOfPolls = 1;
				$.each(pData, function() {	
					var op = JSON.stringify(this['options']);
					var opData = $.parseJSON(op);
					
					var localPollStr = "";
					localPollStr = localPollStr + "<div id="+noOfPolls+" class='pollDivCSS' style='margin-bottom:20px' title='Poll"+noOfPolls+"'>";
					localPollStr = localPollStr + "<table><tr>";
					localPollStr = localPollStr + "<td colspan='2'>"+ this['question'] +" Ends 	<b>"+ this['endDate'] +"</b></td>";					
					localPollStr = localPollStr + "</tr>";
					var objId = this['objectId'] ;
					$.each(opData, function() {
						 localPollStr = localPollStr + "<tr>";
						 localPollStr = localPollStr + "<td><input type='radio' name='rd"+ noOfPolls +"' id='"+this['id']+'&'+ objId +"' value='"+this['id']+"'/></td>";	localPollStr = localPollStr +"<td><label for='"+this['id']+"'>"+this['text']+"</label></td>";
						 localPollStr = localPollStr + "</tr>";
					});				
					localPollStr = localPollStr + "</tr></table>";
					localPollStr = localPollStr + "</div>";					
					pollDivStr = pollDivStr + localPollStr;
					noOfPolls ++;
				});
			$('#pollsDiv').append(pollDivStr); 
			$(':radio').puiradiobutton();   
			$('.pollDivCSS').puipanel({
				toggleable: true
				,closable: true
			});
		});
		
	}
	
 