var userName='';
var userId='';
var DOMAIN_NAME = 'http://www.dukesxi.co';

$(document).bind('login_complete', loggedIn);

 function loggedIn(){
     var userData = JSON.parse(localStorage.getItem('USER_GOOGLE_INFO'));
     $.get("http://www.dukesxi.co/users/"+userData.username,function(data,status){
         userName=data.user.email.substr(0,data.user.email.indexOf('@'));
	 userId=data.user.username;
         polling();
     })
         .fail(function(){
             $('#centerContent').html("<h3>Cricket team member area, please request to join Dukes Cricket Team to access the page.</h3>")
         });
 }
 
 
	function polling(){
		var pollDivStr ='';
        var closeDivStr ='';
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
						var objId = this['_id'] ;
						var localPollStr = "";
						localPollStr = localPollStr + "<div id="+objId+" class='pollDivCSS' style='margin-bottom:20px' title='Poll"+noOfPolls+"'>";
						localPollStr = localPollStr + "<table><th style='background-color: gainsboro;'>";
						localPollStr = localPollStr + "<td colspan='3' style='font-family: monospace;color: darkblue;'>"+ this['question'] +"<br><b style='color: blue;'>Poll Ends	: "+ this['endDate'] +"</b></td>";
						localPollStr = localPollStr + "</th>";
						var previousOptionId = '';
						$.each(opData, function() {
							var dropDownStr ='';
							var hasPollTaken='no';
							var checkedValue =false;
							var optionId = this['text'];
							
							/* create Users DropDown*/
							//dropDownStr = dropDownStr + "<select id='basic' name='basic' class='"+this['pollid']+"'>";
							 var usersTable = "<table>";
							//get the list of users who took poll fot this option
							 if(pData[optionId]){
								var u = JSON.stringify(pData[optionId]);
								var uData = $.parseJSON(u);	
								var userCount = 0;
								$.each( uData,function () {
                                 // dropDownStr = dropDownStr + "<option value='"+userCount+"'>"+this+"</option>";
                                  usersTable = usersTable + "<tr><td style='background-color: greenyellow;font-family: monospace;'>"+this+"</td></tr>"
				      if(this.toString().replace(/\((.*)\)/,'').trim() === userName){
				      hasPollTaken = 'yes';
				      checkedValue = true;
				      previousOptionId = optionId;
                                  }
                                  userCount ++;
                                  });
                                 usersTable = usersTable + "</table>";
								//dropDownStr = dropDownStr +"</select>";

                                 var dialogId = objId +"_" +optionId+"Dialog";
                                dropDownStr = dropDownStr +"<div id="+dialogId+" class='userDialog'>";
                                dropDownStr = dropDownStr + usersTable;
                                dropDownStr = dropDownStr + "</div>";
                                 //<a href='#' onClick='openUsersDialog('"+this['pollid'] +"Dialog')></a>("+uData.length+")

                                dropDownStr = dropDownStr +"<div id='"+objId +"_"+ optionId+"' class='forDialog'>( "+"<a href='#' style='color: blue;'>"+ uData.length +"</a>"+" )</div>";
							}
							/* */
							 localPollStr = localPollStr + "<tr>";
							 
							 localPollStr = localPollStr + "<td><input type='radio' name='rd"+ noOfPolls +"' id='objectId="+ objId + '&'+ optionId +"' value='objectId="+ objId +
                                            '&pollid='+ optionId +"' previousValue ='"+previousOptionId+"' class='objectId="+objId + '&' +optionId +" pollRadio' yourSelection='"+hasPollTaken+"'/></td>";
							 localPollStr = localPollStr +"<td style='background-color: burlywood;'><label for='"+objId+"'>"+this['text']+"</label></td>";
							 
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

                        var objId = this['_id'] ;
                        var closePollStr = "";
                        closePollStr = closePollStr + "<div id="+objId+" class='pollDivCSS' style='margin-bottom:20px' title='Poll"+noOfPolls+"'>";
                        closePollStr = closePollStr + "<table><th style='background-color: gainsboro;'>";
                        closePollStr = closePollStr + "<td colspan='3' style='font-family: monospace;color: darkblue;'>"+ this['question'] +"<br><b style='color: blue;'>Poll Ends	: "+ this['endDate'] +"</b></td>";
                        closePollStr = closePollStr + "</th>";
                        var previousOptionId = '';
                        $.each(opData, function() {
                            var dropDownStr ='';
                            var hasPollTaken='no';
                            var checkedValue =false;
                            var optionId = this["text"];

                            /* create Users DropDown*/

                            var usersTable = "<table>";
                            usersTable = usersTable+ "<th>"+this['text']+"</th>";
                            //get the list of users who took poll fot this option
                            if(pData[optionId]){
                                var u = JSON.stringify(pData[optionId]);
                                var uData = $.parseJSON(u);
                                var userCount = 0;
                                $.each( uData,function () {
                                    // dropDownStr = dropDownStr + "<option value='"+userCount+"'>"+this+"</option>";
                                    usersTable = usersTable + "<tr><td style='background-color: beige;'>"+this+"</td></tr>"

                                    userCount ++;
                                });
                                usersTable = usersTable + "</table>";

                            }
                            /* */
                            closePollStr = closePollStr +usersTable;
                        });

                        closePollStr = closePollStr + "</tr>";

                        closePollStr = closePollStr + "</table>";
                        closePollStr = closePollStr + "</div>";
                        closeDivStr = closeDivStr + closePollStr;
                        noOfPolls ++;
                        //-----------------------
					}
				});
			 
			//$.when( $('#pollsDiv').append(pollDivStr)).then(selectOptions);
            $.when( $('#pollsDiv').append(pollDivStr)).then(selectOptions);
            $.when( $('#closedPollsDiv').append(closeDivStr));
			//$(':radio').puiradiobutton();   
			$('.pollDivCSS').puipanel({
				toggleable: true
				,closable: true
			});
            $('.forDialog').click(function (){

                var dialogId = $(this).attr('id')+"Dialog";
                $( '#'+dialogId ).dialog( "open" );
            });

            $( ".userDialog" ).dialog({
                autoOpen: false,
                show: {
                    effect: "blind",
                    duration: 1000
                },
                hide: {
                    effect: "explode",
                    duration: 1000
                }
            });

			$('[class=pollButton]').click(function() {
				var currentRadio = '';
				var pollid = '';
				var previousOptionId = '';
				var rr =  $("input[type=radio][class*='"+this.id+"']:checked")	.val();
				var str = rr.split('&');
				
				currentRadio = (str[1].split('='))[1];;
				pollid = (str[0].split('='))[1];
								
					previousOptionId = $(this).attr('previousOption');
					//alert('current_option_id :'+currentRadio +',prev_option_id:'+previousOptionId+',username:'+fbUserName);
					$.ajax({
						type: "PUT",
						contentType:'application/json',
						url: '/polls/'+pollid,
						    data: JSON.stringify({'current_option_id':currentRadio,'prev_option_id':previousOptionId,'username':userName,'userId':userId} ),
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
			var objId = pData['_id'] ;
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
						if(this.toString().replace(/\((.*)\)/,'').trim() === userName){
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
	
 