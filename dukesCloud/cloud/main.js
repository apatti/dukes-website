

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