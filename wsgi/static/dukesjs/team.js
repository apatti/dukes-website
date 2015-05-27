
$(document).ready(function(){
	//Adding Player Image
	  $.get("http://tennisballcricket.com/teamplayerbrief?TeamId=184",function(data,status){
         //var pData = $.parseJSON(data);
         var dataInTable ='';
          $.each(data, function() {
             
			 dataInTable = dataInTable + "<div class='player_img'>" + "<table><tr><td><a href='player.html?pid="+this['pid']+"' ><div id='"+ this['pid'] +"'><img src='https://graph.facebook.com/aaaa/picture?type=normal'  class='image' width='100px' height='100px'/></div></td></tr>"
              dataInTable = dataInTable + "<tr><td>"+ this['fname'] +"</td><tr>";
              dataInTable = dataInTable + "</table></div>";
			  
			  
          });	
	  //alert(dataInTable);
         $("#teamDiv").html(dataInTable); 
		updatedImages();
    });  
	
	
	
});
function updatedImages(){
$.get("http://www.dukesxi.co/users/",function(data,status){							
				var rr = JSON.stringify(data.users.results);
				var aa = $.parseJSON(rr);
				$.each(aa, function() {	
					var divId = this.tca_id;
					$('#'+divId).html("<img src='"+this.imagelink+"'  class='image' width='100px' height='100px'/>");
				});			
			});
}
function getImageURL(username){
var imgURL ='';
  if(username.toLowerCase().indexOf("gottiganti")){
		imgURL =  "<img src='https://graph.facebook.com/"+username+"/picture?type=normal'  class='image' width='100px' height='100px'/>"
	  }
	  return imgURL;
}
