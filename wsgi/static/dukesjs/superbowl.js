var DOMAIN_NAME = 'http://www.dukesxi.co';
var username="none";
/*
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
*/

$(document).ready(function(){
	var superbowlObj ='';
	$.get("/superbowl",function(data,status){
		superbowlobj=data;
	        google.load('visualization','1.0',{'packages':['table'],callback:drawChart});
		function drawChart()
		{
		    var datarow = new google.visualization.DataTable();
		    datarow.addColumn('string','User');
		    datarow.addColumn('string','FirstQuarter Total');
		    datarow.addColumn('string','SecondQuarter Total');
		    datarow.addColumn('string','ThirdQuarter Total');
		    datarow.addColumn('string','FourQuarter Total');
		    datarow.addColumn('string','Final Total');
		    datarow.addColumn('string','FirstQuarter Spread');
		    datarow.addColumn('string','SecondQuarter Spread');
		    datarow.addColumn('string','ThirdQuarter Spread');
		    datarow.addColumn('string','FourQuarter Spread');
		    datarow.addColumn('string','Final Spread');
		    for (var i=0;i<data.results.length;i++)
			{
			    var username = data.results[i].username;
			    var firstquartertotal=data.results[i].firstquartertotal;
			    var secondquartertotal=data.results[i].secondquartertotal;
			    var thirdquartertotal=data.results[i].thirdquartertotal;
			    var fourthquartertotal=data.results[i].fourthquartertotal;
			    var finaltotal=data.results[i].finaltotal;
			    var firstquarterspread=data.results[i].firstquarterspread;
			    var secondquarterspread=data.results[i].secondquarterspread;
			    var thirdquarterspread=data.results[i].thirdquarterspread;
			    var fourthquarterspread=data.results[i].fourthquarterspread;
			    var finalspread=data.results[i].finalspread;
		  	    datarow.addRows([[username,firstquarterspread,secondquarterspread,thirdquarterspread,fourthquarterspread,finalspread,firstquarterspread,secondquarterspread,thirdquarterspread,fourthquarterspread,finalspread]]);
			}
		    var batroptions={ title:'Bets','height':600,vAxis:{title:'Runs'}};
		    var batrchart = new google.visualization.Table(document.getElementById('firstquartertotaldiv'));
		    batrchart.draw(datarow);
		}
		/*
		$('#firstquartertotaldiv').puidatatable({
			lazy: true,
			    caption: 'Bets',
			    columns: [
				      {field:'username', headerText: 'User',sortable:false},
				      {field:'firstquartertotal', headerText: 'FirstQuarterTotal',sortable:false},
				      {field:'secondquartertotal', headerText: 'SecondQuarterTotal',sortable:false},
				      {field:'thirdquartertotal', headerText: 'ThirdQuarterTotal',sortable:false},
				      {field:'fourthquartertotal', headerText: 'FourthQuarterTotal',sortable:false},
				      {field:'finalquartertotal', headerText: 'FinalTotal',sortable:false},
				      ],
			    datasource: function(callback,ui)
			    {
				for(i=0;i<data.results.length;i++)
				    {
					var pData = data.results[i];
					callback.call(pData);
				    }
				//var pData=data;
				//callback.call(this,$.makeArray(pData));
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
			    });*/
	    });
	/*	$('input[type=button]').click(function(){
		var firstquartertotal=$('[name=firstquartertotalpoll]:checked').val();
		var secondquartertotal=$('[name=secondquartertotalpoll]:checked').val();
		var thirdquartertotal=$('[name=thirdquartertotalpoll]:checked').val();
		var fourthquartertotal=$('[name=fourthquartertotalpoll]:checked').val();
		var finaltotal=$('[name=finaltotalpoll]:checked').val();
		var firstquarterspread=$('[name=firstquarterspreadpoll]:checked').val();
		var secondquarterspread=$('[name=secondquarterspreadpoll]:checked').val();
		var thirdquarterspread=$('[name=thirdquarterspreadpoll]:checked').val();
		var fourthquarterspread=$('[name=fourthquarterspreadpoll]:checked').val();
		var finalspread=$('[name=finalspreadpoll]:checked').val();
				
		
		var superbowldata=JSON.stringify({'username':username,'firstquartertotal':firstquartertotal,'secondquartertotal':secondquartertotal,'thirdquartertotal':thirdquartertotal,'fourthquartertotal':fourthquartertotal,'finaltotal':finaltotal,'firstquarterspread':firstquarterspread,'secondquarterspread':secondquarterspread,'thirdquarterspread':thirdquarterspread,'fourthquarterspread':fourthquarterspread,'finalspread':finalspread});
		$.ajax({
			type:"POST",
			    contentType:'application/json',
			    url:'/superbowl',
			    data:superbowldata,
			    dataType:'json',
			    success:function(msg)
			    {
				alert("Thanks for the betting entry!!");
				location.href="/superbowl.html";
			    }
		    });
		    });*/
    });