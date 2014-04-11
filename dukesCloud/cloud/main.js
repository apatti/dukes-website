

Parse.Cloud.afterSave("iplplayers",function(request){
    query = new Parse.Query("iplfantasy");
    query.equalTo("username",request.object.get("owner"));
    query.first({
        success:function(user){
            balance = user.get("balance");
            price = request.object.get("price");
            user.set("balance",balance-price);
            user.increment("playercount");
            user.save();
            console.log("Saved, now update the bid index");
            var iplBidIndexQuery = new Parse.Query("iplbidindex");
            iplBidIndexQuery.first({
                success:function(iplBidIndex){
                    console.log("Updating bid index");
                    iplBidIndex.increment("index");
                    iplBidIndex.set("isbidstarted", "false");
                    iplBidIndex.save();
                },
                error:function(err){
                    console.error("Got an error " +err.code+" : " + err.message);
                }
            });
        },
        error:function(err){
            console.error("Got an error " + err.code + " : " + err.message);
        }
    });
});