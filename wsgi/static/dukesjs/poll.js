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
						var objId = this['objectId'] ;
						var localPollStr = "";
						localPollStr = localPollStr + "<div id="+objId+" class='pollDivCSS' style='margin-bottom:20px' title='Poll"+noOfPolls+"'>";
						localPollStr = localPollStr + "<table><tr>";
						localPollStr = localPollStr + "<td colspan='3'>"+ this['question'] +" Ends 	<b>"+ this['endDate'] +"</b></td>";					
						localPollStr = localPollStr + "</tr>";
						var previousOptionId = '';
						$.each(opData, function() {
							var dropDownStr ='';
							var hasPollTaken='no';
							var checkedValue =false;
							var optionId = this['objectId'];
							
							/* create Users DropDown*/
							dropDownStr = dropDownStr + "<select id='basic' name='basic' class='"+this['pollid']+"'>";
							 
							//get the list of users who took poll fot this option
							 if(this['users']){
								var u = JSON.stringify(this['users']);
								var uData = $.parseJSON(u);	
								var userCount = 0;
								$.each( uData,function () {
									dropDownStr = dropDownStr + "<option value='"+userCount+"'>"+this+"</option>";
									if(this.toString() === fbUserName){
										hasPollTaken = 'yes';
										checkedValue = true;
										previousOptionId = optionId;										
									}
									userCount ++;
								});
								dropDownStr = dropDownStr +"</select>";
                                 var dialogId = this['objectId'] + this['pollid'];
                                dropDownStr = dropDownStr +"<div id="+dialogId+" >";
                                dropDownStr = dropDownStr + uData;
                                dropDownStr = dropDownStr + "</div>";
                                 //<a href='#' onClick='openUsersDialog('"+this['pollid'] +"Dialog')></a>("+uData.length+")

                                dropDownStr = dropDownStr +"<div id='"+dialogId+"' class='forDialog'>"+uData.length+"</div>";
							}
							/* */
							 localPollStr = localPollStr + "<tr>";
							 
							 localPollStr = localPollStr + "<td><input type='radio' name='rd"+ noOfPolls +"' id='objectId="+ this['objectId'] + '&'+ this['pollid'] +"' value='objectId="+ this['objectId'] + '&pollid='+ this['pollid'] +"' previousValue ='"+previousOptionId+"' class='"+this['pollid']+" pollRadio' yourSelection='"+hasPollTaken+"'/></td>";	
							 localPollStr = localPollStr +"<td><label for='"+this['objectId']+"'>"+this['text']+"</label></td>";
							 
							 localPollStr = localPollStr + "<td>" + dropDownStr + "</td>";
							 
							 localPollStr = localPollStr + "</td>";
							 localPollStr = localPollStr + "</tr>";
						});				
						localPollStr = localPollStr + "</tr>";
						localPollStr = localPollStr + "<td>";
						localPollStr = localPollStr + "<div>";
						localPollStr = localPollStr + "<button id='"+objId+"' type='button' class='pollButton' previousOption='"+ previousOptionId +"'>Submit You Poll</button>";						
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
			 
			$.when( $('#pollsDiv').html(pollDivStr)).then(selectOptions);
			//$(':radio').puiradiobutton();   
			$('.pollDivCSS').puipanel({
				toggleable: true
				,closable: true
			});
            $('.forDialog').click(function (){

                var dialogId = $(this).attr('id');
                alert(dialogId);
                $( '#'+dialogId ).dialog( "open" );
            });
			$('[class=pollButton]').click(function() {
				var currentRadio = '';
				var pollid = '';
				var previousOptionId = '';
				var rr =  $("input[type=radio][class*='"+this.id+"']:checked")	.val();
				var str = rr.split('&');
				
				currentRadio = (str[0].split('='))[1];;
				pollid = (str[1].split('='))[1];
								
					previousOptionId = $(this).attr('previousOption');
					alert('current_option_id :'+currentRadio +',prev_option_id:'+previousOptionId+',username:'+fbUserName);
					$.ajax({
						type: "PUT",
						contentType:'application/json',
						url: '/polls/'+pollid,
						data: JSON.stringify({'current_option_id':currentRadio,'prev_option_id':previousOptionId,'username':fbUserName} ),
						dataType: 'json',
						success: function(msg) {
						   alert("Thank you for Taking Poll.");
						   //updatePollDetails(pollid,99);
						   location.reload();
						   //location.href="/";
					   }
					});	
			});
			
		});
		
			 
		
		return;
	}
	function selectOptions(){
	// update all radio buttons
	$("input:radio[class$='pollRadio']").each(function(){
		  var name = $(this).attr("yourSelection");
		  if(name === 'yes'){					
			this.click();					
		  }
		});
	}
function updatePollDetails(pollId,noOfPolls ){
	$.get("http://www.dukesxi.co/polls/"+pollId,function(data,status){
		var rr = JSON.stringify(data);	
		var pData = $.parseJSON(rr);
		var op = JSON.stringify(pData['options']);
		var opData = $.parseJSON(op);
	
		//Open Polls
		if(pData['isClosed'] == 0 ){
			var objId = pData['objectId'] ;
			var updateProllStr = "";
			updateProllStr = updateProllStr + "<div id="+objId+" class='pollDivCSS' style='margin-bottom:20px' title='Poll"+noOfPolls+"'>";
			updateProllStr = updateProllStr + "<table><tr>";
			updateProllStr = updateProllStr + "<td colspan='3'>"+ pData['question'] +" Ends 	<b>"+ pData['endDate'] +"</b></td>";					
			updateProllStr = updateProllStr + "</tr>";
			
			$.each(opData, function() {
				var dropDownStr ='';
				var hasPollTaken='no';
				var checkedValue =false;
				var optionId = this['objectId'];
				var previousOptionId = '';
				/* create Users DropDown*/
				dropDownStr = dropDownStr + "<select id='basic' name='basic' class='"+this['pollid']+"'>";
				 
				//get the list of users who took poll fot this option
				 if(this['users']){
					var u = JSON.stringify(this['users']);
					var uData = $.parseJSON(u);	
					var userCount = 0;
					$.each( uData,function () {
						dropDownStr = dropDownStr + "<option value='"+userCount+"'>"+this+"</option>";
						if(this.toString() === fbUserName){
							hasPollTaken='yes';
							checkedValue =true;
							previousOptionId = optionId;
						}
						userCount ++;
					});
					dropDownStr = dropDownStr +"</select> <div id='"+'pollid='+ this['pollid']+"Div' style='color:blue;' class='"+this['pollid']+"' >("+uData.length+")</div>";
				}
				/* */
				 updateProllStr = updateProllStr + "<tr>";
							 
				 updateProllStr = updateProllStr + "<td><input type='radio' name='rd"+ noOfPolls +"' id='objectId="+ this['objectId'] + '&'+ this['pollid'] +"' value='objectId="+ this['objectId'] + '&pollid='+ this['pollid'] +'&previousValue='+ previousOptionId +"' previousValue ='"+previousOptionId+"' class='"+this['pollid']+" pollRadio' yourSelection='"+hasPollTaken+"'/></td>";	
				 updateProllStr = updateProllStr +"<td><label for='"+this['objectId']+"'>"+this['text']+"</label></td>";
				 
				 updateProllStr = updateProllStr + "<td>" + dropDownStr + "</td>";
				 
				 updateProllStr = updateProllStr + "</td>";
				 updateProllStr = updateProllStr + "</tr>";
			});				
				updateProllStr = updateProllStr + "</tr>";
				updateProllStr = updateProllStr + "<td>";
				updateProllStr = updateProllStr + "<div>";
				updateProllStr = updateProllStr + "<button id='"+objId+"' type='button' class='pollButton'>Submit You Poll</button>";						
				updateProllStr = updateProllStr + "</div>";
				updateProllStr = updateProllStr + "</td>";
				updateProllStr = updateProllStr + "</table>";
				updateProllStr = updateProllStr + "</div>";					
				//pollDivStr = pollDivStr + updateProllStr;
				
			}
			$.when( $('#'+pollId).html(updateProllStr)).then(selectOptions);
			 
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
	
 