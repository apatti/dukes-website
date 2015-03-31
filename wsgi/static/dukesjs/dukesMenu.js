 $(document).ready(function(){
	var dukesMenu = "<ul id='mb1'>";
		dukesMenu = dukesMenu +"<li id='homeTab'> <a href='home.html' data-icon='ui-icon-home'>Home</a></li>";
		dukesMenu = dukesMenu +"<li id='teamTab'> <a href='team.html' data-icon='ui-icon-person'>Team</a></li>";
		dukesMenu = dukesMenu +"<li id='statsTab'> <a href='teamstats.html' data-icon='ui-icon-document'>Stats</a></li>";
		//dukesMenu = dukesMenu +"<li id='newsTab'> <a data-icon='ui-icon-document'>News</a></li>";
		dukesMenu = dukesMenu +"<li id='profileTab'> <a href='profile.html' data-icon='ui-icon-contact'>Profile</a></li>";
		dukesMenu = dukesMenu +"<li id='galleryTab'> <a href='gallery.html' data-icon='ui-icon-image'>Gallery</a></li>";
		dukesMenu = dukesMenu +"<li id='pollTab'> <a href='poll.html' data-icon='ui-icon-radio-on'>Poll</a></li>";
        //dukesMenu = dukesMenu +"<li id='pollTab'> <a href='dukesfantasy.html' data-icon='ui-icon-document'>Fantasy</a></li>";
        dukesMenu = dukesMenu +"<li id='umpireTab'> <a href='umpiring.html' data-icon='ui-icon-clipboard'>Umpires</a></li>";
		//dukesMenu = dukesMenu +"<li id='biddingTab'> <a href='auction.html' data-icon='ui-icon-document'>Bidding</a></li>";
		dukesMenu = dukesMenu +"<li id='adminTab'> <a href='admin.html' data-icon='ui-icon-locked'>Admin</a></li>";
		dukesMenu = dukesMenu +"<li id='joinTab'> <a href='joinus.html' data-icon='ui-icon-plusthick'>Join Us</a></li>";
		dukesMenu = dukesMenu +"<li id='iplTab'> <a href='ipl.html' data-icon='ui-icon-locked'>IPL Fantasy</a></li>";
		dukesMenu = dukesMenu +"</ul>";				 
 $("#navigation").html(dukesMenu);  
  $('#mb1').puimenubar();
  
 });