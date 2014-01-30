var DOMAIN_NAME = 'http://www.dukesxi.co';
$(document).ready(function(){
	$.get(DOMAIN_NAME +'/gallery/',function(data,status){
		//var results = JSON.stringify(data.user.results[0]);	
		
		var pData = $.parseJSON(data);
		var galleryDiv = '';		
		galleryDiv = galleryDiv + '<ul>';		
		$.each(pData, function() {			 
			
			galleryDiv = galleryDiv + '<li><img src="images/gallery/'+this['img']+'" alt="" title="" width="600px" height="450px"/></li>';
					
		});
		galleryDiv = galleryDiv + '</ul>';	
		$('#teamGalleryDiv').html(galleryDiv);
		
		$('#teamGalleryDiv').puigalleria({
				panelWidth: 800,
				panelHeight: 500
		});
	});
	
	
});


function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}