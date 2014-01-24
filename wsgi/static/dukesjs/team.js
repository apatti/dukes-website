
$(document).ready(function(){
	//Adding Player Image
	  $.get("http://www.tennisballcricket.org/cricket_module/mobile_service.php?action=getTeamPlayers&tid=184",function(data,status){
         var pData = $.parseJSON(data);
         
          $.each(pData, function() {
			createImage(this['pid'],this['fname'],this['lname']);	
				
             
          });	
	  //alert(dataInTable);
                  
    });  
	
});

function createImage(pid,fName,lName){

	$.get("http://www.dukesxi.co/users/tca/"+pid,function(momData,status){
				var results = JSON.stringify(momData.user.results[0]);		
				var userData = $.parseJSON(results);
				var imgURL ='';
				var dataInTable ='';
				
				 dataInTable = dataInTable + "<div class='player_img'>" + "<table><tr><td><a href='player.html?pid="+ pid +"' ><img src='https://graph.facebook.com/"+userData['username']+"/picture?type=normal'  class='image' width='100px' height='100px'/></a></td></tr>"
              dataInTable = dataInTable + "<tr><td>"+ fName +" "+ lName +"</td><tr>";
              dataInTable = dataInTable + "</table></div>";
				$("#teamDiv").html(dataInTable);
			});

}
