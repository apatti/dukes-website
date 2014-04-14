 $(document).ready(function(){
	var dukesMenu = "<ul id='mb1'>";
		dukesMenu = dukesMenu +"<li id='homeTab'> <a href='home.html' data-icon='ui-icon-document'>Home</a></li>";
		dukesMenu = dukesMenu +"<li id='teamTab'> <a href='team.html' data-icon='ui-icon-document'>Team</a></li>";
		dukesMenu = dukesMenu +"<li id='statsTab'> <a href='teamstats.html' data-icon='ui-icon-document'>Stats</a></li>";
		dukesMenu = dukesMenu +"<li id='newsTab'> <a data-icon='ui-icon-document'>News</a></li>";
		dukesMenu = dukesMenu +"<li id='profileTab'> <a href='profile.html' data-icon='ui-icon-document'>Profile</a></li>";
		dukesMenu = dukesMenu +"<li id='galleryTab'> <a href='gallery.html' data-icon='ui-icon-document'>Gallery</a></li>";
		dukesMenu = dukesMenu +"<li id='pollTab'> <a href='poll.html' data-icon='ui-icon-document'>Poll</a></li>";
        dukesMenu = dukesMenu +"<li id='pollTab'> <a href='dukesfantasy.html' data-icon='ui-icon-document'>Fantasy</a></li>";
        dukesMenu = dukesMenu +"<li id='iplTab'> <a href='ipl.html' data-icon='ui-icon-document'>IPL</a></li>";
		//dukesMenu = dukesMenu +"<li id='biddingTab'> <a href='auction.html' data-icon='ui-icon-document'>Bidding</a></li>";
		dukesMenu = dukesMenu +"<li id='adminTab'> <a href='admin.html' data-icon='ui-icon-document'>Admin</a></li>";
		dukesMenu = dukesMenu +"</ul>";				 
 $("#navigation").html(dukesMenu);  
  $('#mb1').puimenubar();
  
 });