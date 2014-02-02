var DOMAIN_NAME = 'http://www.dukesxi.co';
var username="none";

 window.fbAsyncInit = function() {
	  FB.init({
		appId      : '627120887325860',
		status     : true, // check login status
		cookie     : true, // enable cookies to allow the server to access the session
		xfbml      : true  // parse XFBML
	  });
	  FB.Event.subscribe('auth.logout', function(response) {
	   logout();
	   $('#loggedUserDiv').html("");
		});
		FB.Event.subscribe('auth.login', function() {
		  location.reload();
		});
		
		 FB.getLoginStatus(function(response) {
		  if (response.status === 'connected') {
			loggedIn();
			var uid = response.authResponse.userID;			
			var accessToken = response.authResponse.accessToken;
			
			
		  } else if (response.status === 'not_authorized') {
			// the user is logged in to Facebook, 
			// but has not authenticated your app
			localStorage.removeItem('USER_FB_INFO');
		  } else {
			// the user isn't logged in to Facebook.
			localStorage.removeItem('USER_FB_INFO');
		  }
		 });
		 applyCSSToPageComponents();
 };
	   
function loggedIn(){
 FB.api('/me', function(response) {
	//var userData = $.parseJSON(localStorage.getItem('USER_FB_INFO'));
	$('#loggedUserDiv').html(response.username);
			$('#nameDiv').html("<h3>Name : </h>"+response.name);
			$('#fNameDiv').html("<h3>First Name : </h>"+response.first_name);
			$('#lNameDiv').html("<h3>Last Name : </h>"+response.last_name);
			$('#fbLinkDiv').html("<h3>FB Link : </h>"+response.link);
			Email : 
			$('#fbLinkDiv').html("<h3>Email : </h><input id='emailTxt' type='text' />");
			$('#fbProfileImg').html("<img src='https://graph.facebook.com/"+response.username+"/picture?type=normal' class='image' width='100px' height='100px'/>");
			
			username=response.username;
 });
}   


$(document).ready(function(){
	var superbowlObj ='';
	$.get("/superbowl",function(data,status){
		superbowlobj=data;
		$('#firstquartertotaldiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'firstquartertotalover', headerText: 'Over',sortable:false},
				      {field:'firstquartertotalunder', headerText: 'Under',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				var pData=data;
				callback.call(this,$.makeArray(pData));
			    }
		    });
		$('#secondquartertotaldiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'secondquartertotalover', headerText: 'Over',sortable:false},
				      {field:'secondquartertotalunder', headerText: 'Under',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				var pData=data;
				callback.call(this,$.makeArray(pData));
			    }
		    });
		$('#thirdquartertotaldiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'thirdquartertotalover', headerText: 'Over',sortable:false},
				      {field:'thirdquartertotalunder', headerText: 'Under',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				var pData=data;
				callback.call(this,$.makeArray(pData));
			    }
		    });
		$('#fourthquartertotaldiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'fourthquartertotalover', headerText: 'Over',sortable:false},
				      {field:'fourthquartertotalunder', headerText: 'Under',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				var pData=data;
				callback.call(this,$.makeArray(pData));
			    }
		    });
		$('#finaltotaldiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'finaltotalover', headerText: 'Over',sortable:false},
				      {field:'finaltotalunder', headerText: 'Under',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				var pData=data;
				callback.call(this,$.makeArray(pData));
			    }
		    });
		$('#firstquarterspreaddiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'firstquarterspreadbroncos', headerText: 'Broncos',sortable:false},
				      {field:'firstquarterspreadseahawks', headerText: 'Seahawks',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				var pData=data;
				callback.call(this,$.makeArray(pData));
			    }
		    });
		$('#secondquarterspreaddiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'secondquarterspreadbroncos', headerText: 'Broncos',sortable:false},
				      {field:'secondquarterspreadseahawks', headerText: 'Seahawks',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				var pData=data;
				callback.call(this,$.makeArray(pData));
			    }
		    });
		$('#thirdquarterspreaddiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'thirdquarterspreadbroncos', headerText: 'Broncos',sortable:false},
				      {field:'thirdquarterspreadseahawks', headerText: 'Seahawks',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				var pData=data;
				callback.call(this,$.makeArray(pData));
			    }
		    });
		$('#fourthquarterspreaddiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'fourthquarterspreadbroncos', headerText: 'Broncos',sortable:false},
				      {field:'fourthquarterspreadseahawks', headerText: 'Seahawks',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				var pData=data;
				callback.call(this,$.makeArray(pData));
			    }
		    });
		$('#finalspreaddiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'finalquarterspreadbroncos', headerText: 'Broncos',sortable:false},
				      {field:'finalquarterspreadseahawks', headerText: 'Seahawks',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				var pData=data;
				callback.call(this,$.makeArray(pData));
			    }
		    });
	    });
	$('input[type=button]').click(function(){
		var firstquartertotal=$('[name=firstquartertotalpoll]:checked').val();
		var secondquartertotal=$('[name=secondquartertotalpoll]:checked').val();
		var thirdquartertotal=$('[name=thirdquartertotalpoll]:checked').val();
		var fourthquartertotal=$('[name=fourthquartertotalpoll]:checked').val();
		var finaltotal=$('[name=finaltotalpoll]:checked').val();
		var firstquarterspread=$('[name=firstquarterspreadpoll]:checked').val();
		var secondquarterspread=$('[name=secondquarterspreadpoll]:checked').val();
		var thirdquarterspread=$('[name=thirdquarterspreadpoll]:checked').val();
		var fourthquarterspread=$('[name=fourthquarterspreadpoll]:checked').val();
		var finaltotal=$('[name=finalspreadpoll]:checked').val();

		var superbowldata=JSON.stringify({'username':username,'firstquartertotal':firstquartertotal,'secondquartertotal':secondquartertotal,'thirdquartertotal':thirdquartertotal,'fourthquartertotal':fourthquartertotal,'finaltotal':finaltotal,'firstquarterspread':firstquarterspread,'secondquarterspread':secondquarterspread,'thirdquarterspread':thirdquarterspread,'fourthquarterspread':fourthquarterspread,'finaltotal':finalspread});
		alert(superbowldata);
	    });
    });