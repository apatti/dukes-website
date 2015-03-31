

Parse.Cloud.afterSave("iplplayer",function(request){
    query = new Parse.Query("iplfantasy");
    query.equalTo("username",request.object.get("owner"));
    query.first({
        success:function(user){
            balance = user.get("balance");
            price = request.object.get("Price");
            user.set("balance",balance-price);
            //user.increment("playercount");
            user.save();
            console.log("Saved");
            /*
            var iplBidIndexQuery = new Parse.Query("iplbidindex");
            iplBidIndexQuery.first({
                success:function(iplBidIndex){
                        console.log("Updating bid index");
                        iplBidIndex.increment("index");
                        iplBidIndex.set("isbidstarted", false);
                        iplBidIndex.save().then(function(obj){console.log("Update completed")},
                        function(err){
                            console.error("Got an error " +err.code+" : " + err.message);
                        });
                    },
                    error:function(err){
                        console.error("Got an error " +err.code+" : " + err.message);
                    }
                });*/

        },
        error:function(err){
            console.error("Got an error " + err.code + " : " + err.message);
        }
    });
});


Parse.Cloud.afterSave("iplfantasybids",function(request){
    var BidEntryTable = Parse.Object.extend("bidhistory");
    bidentry = new BidEntryTable();
    bidentry.set("owner",request.object.get("username"));
    bidentry.set("playertoaddid",request.object.get("playertoaddobjectid"));
    bidentry.set("playertoaddname",request.object.get("playertoaddname"));
    bidentry.set("playertodropid",request.object.get("playertodropobjectid"));
    bidentry.set("playertodropname",request.object.get("playertodropname"));
    bidentry.set("amount",request.object.get("bidamount"));
    bidentry.set("priority",request.object.get("priority"));
    bidentry.set("bidobjectid",request.object.id);
    bidentry.save({
        success:function(){
            console.log("Saved")
        },
        error:function(err){
            console.error("Got an error "+ err.code + " : " +err.message )
        }
    });

});

Parse.Cloud.define("getIplFantasySchedule",function(request,response){
    var userObject = Parse.Object.extend("user");
    var userQuery = new Parse.Query(userObject);
    userQuery.exists("iplteam");
    userQuery.find().then(function(results){
        var userIplTeamNames = {};
        for(var i=0;i<results.length;i++)
        {
            userIplTeamNames[results[i].get('first_name')]=results[i].get('iplteam');
        }

        var scheduleObject = Parse.Object.extend("iplfantasyschedule");
        var scheduleQuery = new Parse.Query(scheduleObject);
        scheduleQuery.ascending('fantasyweek');
        scheduleQuery.find().then(function(scheduleResults){
            var finalSchedule=[];
           for(var i=0;i<scheduleResults.length;i++)
           {
               var sched={};
               sched['fantasyweek']=scheduleResults[i].get('fantasyweek');
               sched['fantasyweekname']=scheduleResults[i].get('fantasyweekname');
               sched['league']=scheduleResults[i].get('league');
               var team1=scheduleResults[i].get('team1');
               var team2=scheduleResults[i].get('team2');
               if(team1 in userIplTeamNames)
               {
                   sched['team1'] =userIplTeamNames[team1];
               }
               else
               {
                   sched['team1'] =team1;
               }
               if(team2 in userIplTeamNames)
               {
                   sched['team2']=userIplTeamNames[team2];
               }
               else
               {
                   sched['team2']=team2;
               }
               finalSchedule.push(sched);
           }
            response.success(finalSchedule);
        });
        //response.success(userIplTeamNames);
    });

});

Parse.Cloud.define("getIplUsers",function(request,response){
    var userObject = Parse.Object.extend("user");
    var userQuery = new Parse.Query(userObject);
    userQuery.exists("iplteam");
    userQuery.find().then(function(results){
        var userIplTeamNames = {};
        for(var i=0;i<results.length;i++)
        {
            userIplTeamNames[results[i].get('first_name')]=results[i].get('iplteam');
        }
        response.success(userIplTeamNames);
    });
})