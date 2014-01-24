 $(document).ready(function(){
              
				
	var dukesMenu = "<ul id='mb1'>";
		dukesMenu = dukesMenu +"<li id='homeTab'> <a href='home.html' data-icon='ui-icon-document'>Home</a></li>";
		dukesMenu = dukesMenu +"<li id='teamTab'> <a href='team.html' data-icon='ui-icon-document'>Team</a></li>";
		dukesMenu = dukesMenu +"<li id='statsTab'> <a href='teamstats.html' data-icon='ui-icon-document'>Stats</a></li>";
		dukesMenu = dukesMenu +"<li id='newsTab'> <a data-icon='ui-icon-document'>News</a></li>";
		dukesMenu = dukesMenu +"<li id='profileTab'> <a href='profile.html' data-icon='ui-icon-document'>Profile</a></li>";
		dukesMenu = dukesMenu +"</ul>";				 
 $("#navigation").html(dukesMenu);  
  $('#mb1').puimenubar();
  
 });