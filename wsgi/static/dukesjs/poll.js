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
		$.get("http://www.dukesxi.co/polls",function(data,status){
				var dd = $.parseJSON(data);
				var noOfPolls = 1;
				$.each(dd, function() {	
					var rr = JSON.stringify(this);	
					var pData = $.parseJSON(rr);
					var op = JSON.stringify(pData['options']);
					var opData = $.parseJSON(op);
				
					//Open Polls
					if(this['isClosed'] == 0 ){
						if(this['username'] === fbUserName ){
						}else{
						}
						var localPollStr = "";
						localPollStr = localPollStr + "<div id="+noOfPolls+" class='pollDivCSS' style='margin-bottom:20px' title='Poll"+noOfPolls+"'>";
						localPollStr = localPollStr + "<table><tr>";
						localPollStr = localPollStr + "<td colspan='3'>"+ this['question'] +" Ends 	<b>"+ this['endDate'] +"</b></td>";					
						localPollStr = localPollStr + "</tr>";
						var objId = this['objectId'] ;
						$.each(opData, function() {
							var dropDownStr ='';
							var hasPollTaken=0;
							/* create Users DropDown*/
							dropDownStr = dropDownStr + "<select id='basic' name='basic' class='"+this['pollid']+"'>";
							 
							//get the list of users who took poll fot this option
							 if(this['users']){
								var u = JSON.stringify(this['users']);
								var uData = $.parseJSON(u);	
								var userCount = 0;
								$.each( uData,function () {
									dropDownStr = dropDownStr + "<option value='"+userCount+"'>"+this+"</option>";
									if(this === fbUserName){
										hasPollTaken = 1;
									}
									userCount ++;
								});
								dropDownStr = dropDownStr +"</select> <div id='"+this['id']+'&pollid='+ this['pollid']+"Div' style='color:blue;' class='"+this['pollid']+"' >("+userCount+")</div>";
							}
							/* */
							 localPollStr = localPollStr + "<tr>";
							 localPollStr = localPollStr + "<td><input type='radio' checked='"+hasPollTaken+"' name='rd"+ noOfPolls +"' id='"+this['id']+'&objectId='+ this['objectId'] + '&'+ this['pollid'] +"' value='"+this['id']+'&'+ this['objectId'] + '&pollid='+ this['pollid']  +"' class='"+this['pollid']+"'/></td>";	
							 localPollStr = localPollStr +"<td><label for='"+this['id']+"'>"+this['text']+"</label></td>";
							 
							 localPollStr = localPollStr + "<td>" + dropDownStr + "</td>";
							 
							 localPollStr = localPollStr + "</td>";
							 localPollStr = localPollStr + "</tr>";
						});				
						localPollStr = localPollStr + "</tr>";
						localPollStr = localPollStr + "<td>";
						localPollStr = localPollStr + "<div>";
						localPollStr = localPollStr + "<button id='"+objId+"' type='button' class='pollButton'>Submit You Poll</button>";						
						localPollStr = localPollStr + "</div>";
						localPollStr = localPollStr + "</td>";
						localPollStr = localPollStr + "</table>";
						localPollStr = localPollStr + "</div>";					
						pollDivStr = pollDivStr + localPollStr;
						noOfPolls ++;
					}else{
						// Closed Polls
					}
				});
			$('#pollsDiv').append(pollDivStr); 
			$(':radio').puiradiobutton();   
			$('.pollDivCSS').puipanel({
				toggleable: true
				,closable: true
			});			
			$('[class=pollButton]').click(function() {
				 // alert( this.id );
				 //var selectedRadio = $('input:radio[name='+this.id+']:checked').val();
				 
				 var str = $('input[type=radio][class='+this.id+']:checked').val().split('&');
					var optionId = str[0];
					var pollid = (str[2].split('='))[1];
					$.ajax({
						type: "PUT",
						contentType:'application/json',
						url: '/polls/'+pollid,
						data: JSON.stringify({'id':parseInt(optionId),'username':fbUserName} ),
						dataType: 'json',
						success: function(msg) {
						   alert("Thank you for Taking Poll.");
						   location.href="/";
					   }
					});
				 
				/*
				$('input[type=radio][class='+this.id+']').each(function (){
					alert($(this).val() );
				  });
				 */
				});
		});
		
		
	}
	function usersDropDown( users,pollId){
		var dropDownStr = '';
		var u = JSON.stringify(users);
		var uData = $.parseJSON(u);	
		var userCount = 0;
		$.each( uData,function () {
			dropDownStr = dropDownStr + "<option value='"+userCount+"'>"+this+"</option>";
			userCount ++;
		});
		dropDownStr = dropDownStr +"</select> <div style='color:blue;' class='"+pollId+"' >("+userCount+")</div>";
		dropDownStr = dropDownStr + "</td>";
		return dropDownStr;
	}
	
 