$(document).ready(function(){
	
	var galleryDiv = '';
		
		galleryDiv = galleryDiv + '<a href="/images/morne_morkel2-101x116.jpg">';
		galleryDiv = galleryDiv + '<img src="images/morne_morkel2-101x116.jpg" alt="Sopranos 1"/>';
		galleryDiv = galleryDiv + '</a>';
		galleryDiv = galleryDiv + '<a href="/images/morne_morkel2-101x116.jpg">';
		galleryDiv = galleryDiv + '<img src="images/morne_morkel2-101x116.jpg" alt="Sopranos 2"/>';
		galleryDiv = galleryDiv + '</a>';
		galleryDiv = galleryDiv + '<a href="/images/morne_morkel2-101x116.jpg">';
		galleryDiv = galleryDiv + '<img src="images/morne_morkel2-101x116.jpg" alt="Sopranos 3"/>';
		galleryDiv = galleryDiv + '</a>';
		
		$('#teamGalleryDiv').http(galleryDiv);
	
});


function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}