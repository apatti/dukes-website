 $(document).ready(function(){
              
				
	var dukesMenu = "<ul id='mb1'>";
		dukesMenu = dukesMenu +"<li> <a href='home.html' data-icon='ui-icon-document'>Home</a></li>";
		dukesMenu = dukesMenu +"<li> <a href='team.html' data-icon='ui-icon-document'>Team</a></li>";
		dukesMenu = dukesMenu +"<li> <a data-icon='ui-icon-document'>Cricket</a></li>";
		dukesMenu = dukesMenu +"<li> <a data-icon='ui-icon-document'>News</a></li>";
		dukesMenu = dukesMenu +"<li id='profileTab'> <a href='profile.hrml' data-icon='ui-icon-document'>Profile</a></li>";
		dukesMenu = dukesMenu +"</ul>";				 
 $("#navigation").html(dukesMenu);  
  $('#mb1').puimenubar();
  
 });