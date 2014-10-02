/**
 * Created by apatti on 9/28/14.
 */

$(function()
{
    $('#saveDiv').hide();
    $('#roleDiv').hide();
});

$(document).bind('login_complete', loggedIn);

var userData="";

function loggedIn(){
    userData = $.parseJSON(localStorage.getItem('USER_GOOGLE_INFO'));
    $('#nameDiv').html("<h3>Name : </h>"+userData.name);
			$('#fNameDiv').html("<h3>First Name : </h>"+userData.first_name);
			$('#lNameDiv').html("<h3>Last Name : </h>"+userData.last_name);
			Email :
			$('#emailTxtDiv').html("<h3>Email : </h><input id='emailTxt' type='text' value="+userData.email+">");
			$('#profileImg').html("<img src="+userData.imagelink+" class='image' width='100px' height='100px'/>");
            $('#saveDiv').show();
            $('#roleDiv').show();
            applyCSSToPageComponents();
}

function onClickSaveBtn()
{
    userData.email = $('#emailTxt').val();
    if($('#cricketCheckBox').is(":checked"))
    {
        userData.tca_associated=-1;
    }

    $.post("http://www.dukesxi.co/users",userData,function(){
        alert("Information saved!!")
    })
        .fail(function(){
           alert("Failed");
        });
}

function applyCSSToPageComponents(){
	$('#default').puipanel();
	$('#dukesTeamSelect').puidropdown();
	$('#associateBtn').puibutton();
	$('#emailTxt').puiinputtext();
}