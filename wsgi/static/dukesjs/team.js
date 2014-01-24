
$(document).ready(function(){
	//Adding Player Image
	  $.get("http://www.tennisballcricket.org/cricket_module/mobile_service.php?action=getTeamPlayers&tid=184",function(data,status){
         var pData = $.parseJSON(data);
         var dataInTable ='';
          $.each(pData, function() {			 
              dataInTable = dataInTable + "<div class='player_img'>" + "<table><tr><td><a href='player.html?pid="+this['pid']+"' >"+getImageURL( this['pid'],fbUserName)+"</a></td></tr>"
              dataInTable = dataInTable + "<tr><td>"+ this['fname'] +" "+ this['lname'] +"</td><tr>";
              dataInTable = dataInTable + "</table></div>";
          });	
	  //alert(dataInTable);
         $("#teamDiv").html(dataInTable);         
    });  
	
});

function getImageURL(pid,username){

	$.get("http://www.dukesxi.co/users/tca/"+pid,function(momData,status){
				var results = JSON.stringify(momData.user.results[0]);		
				var userData = $.parseJSON(results);
				var imgURL ='';
				  if(username.toLowerCase().indexOf("gottiganti")){
						imgURL =  "<img src='https://graph.facebook.com/"+userData['username']+"/picture?type=normal'  class='image' width='100px' height='100px'/>"
					  }
					  return imgURL;
			});

}
