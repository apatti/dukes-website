
$(document).ready(function(){
	//Adding Player Image
	  $.get("http://www.tennisballcricket.org/cricket_module/mobile_service.php?action=getTeamPlayers&tid=184",function(data,status){
         var pData = $.parseJSON(data);
         var dataInTable ='';
          $.each(pData, function() {			 
             
			 dataInTable = dataInTable + "<div class='player_img'>" + "<table><tr><td><a href='player.html?pid="+this['pid']+"' ><div id='"+ this['pid'] +"'><img src='images/morne_morkel2-101x116.jpg'  class='image' width='100px' height='100px'/></div></td></tr>"
              dataInTable = dataInTable + "<tr><td>"+ this['fname'] +" "+ this['lname'] +"</td><tr>";
              dataInTable = dataInTable + "</table></div>";
			  
			  
          });	
	  //alert(dataInTable);
         $("#teamDiv").html(dataInTable);         
    });  
	
	$.get("http://www.dukesxi.co/users/",function(data,status){
							
				var rr = JSON.stringify(data.users.results);
				var aa = $.parseJSON(rr);
				$.each(aa, function() {	
					var divId = this.tca_id;
					$('#'+divId).html("<img src='https://graph.facebook.com/"+this.username+"/picture?type=normal'  class='image' width='100px' height='100px'/>"); 
				});
				/*var userData = $.parseJSON(results);
				
				var playerOfTheWeek = '';
				
				//var username ="pram.gottiganti";
				playerOfTheWeek = playerOfTheWeek + "<table><tr>";
				playerOfTheWeek = playerOfTheWeek + "<td><img  src='https://graph.facebook.com/"+userData['username']+"/picture?type=normal'  class='image' width='75px' height='75px'/></td>";
				playerOfTheWeek = playerOfTheWeek + "<td><h3><a href=/player.html?pid="+tca_id+">"+ mom +"</a></h3></td>";
				playerOfTheWeek = playerOfTheWeek + "</tr></table>";
				
				
				$("#playerOfTheWeekDiv").append(playerOfTheWeek);
				*/
			});
	
});

function getImageURL(username){
var imgURL ='';
  if(username.toLowerCase().indexOf("gottiganti")){
		imgURL =  "<img src='https://graph.facebook.com/"+username+"/picture?type=normal'  class='image' width='100px' height='100px'/>"
	  }
	  return imgURL;
}
