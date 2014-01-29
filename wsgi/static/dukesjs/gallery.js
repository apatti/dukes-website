var DOMAIN_NAME = 'http://www.dukesxi.co';
$(document).ready(function(){
	$.get(DOMAIN_NAME +'/gallery/',function(data,status){
		//var results = JSON.stringify(data.user.results[0]);	
		
		var pData = $.parseJSON(data);
		var galleryDiv = '';		 
		$.each(pData, function() {			 
			galleryDiv = galleryDiv + '<a href="/images/gallery/'+this['img']+'">';
			galleryDiv = galleryDiv + '<img src="images/gallery/'+this['img']+'" alt="Sopranos 1"/>';
			galleryDiv = galleryDiv + '</a>';			
		});
		
		$('#teamGalleryDiv').html(galleryDiv);
	});
	
	
});


function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}