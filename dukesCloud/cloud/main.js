

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
        },
        error:function(err){
            console.error("Got an error " + err.code + " : " + err.message);
        }
    });
});