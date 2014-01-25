
$(document).ready(function(){
	//Adding Player Image
	  $.get("http://www.tennisballcricket.org/cricket_module/mobile_service.php?action=getTeamPlayers&tid=184",function(data,status){
         var pData = $.parseJSON(data);
         var dataInTable ='';
          $.each(pData, function() {			 
             
			 dataInTable = dataInTable + "<div class='player_img'>" + "<table><tr><td><a href='player.html?pid="+this['pid']+"' ><div id='"+ this['pid'] +"'></div></td></tr>"
              dataInTable = dataInTable + "<tr><td>"+ this['fname'] +" "+ this['lname'] +"</td><tr>";
              dataInTable = dataInTable + "</table></div>";
			  
			  
          });	
	  //alert(dataInTable);
         $("#teamDiv").html(dataInTable);         
    });  
	
});

function getImageURL(username){
var imgURL ='';
  if(username.toLowerCase().indexOf("gottiganti")){
		imgURL =  "<img src='https://graph.facebook.com/"+username+"/picture?type=normal'  class='image' width='100px' height='100px'/>"
	  }
	  return imgURL;
}
