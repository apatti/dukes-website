__author__ = 'apatti'
import json,httplib,urllib
from iplstandings import getIplStanding
import operator

def viewAllTransactions(league):
    params = urllib.urlencode({"where":json.dumps({
        "league":league
    }),"order":"-updatedAt,-amount,playertoaddname,bidresult","limit":300});

    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplbidresult?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    #result = json.loads(connection.getresponse().read())
    return json.loads(connection.getresponse().read())

def viewAllBids(league):
    params = urllib.urlencode({"where":json.dumps({
        "bidobjectid":{
            "$dontSelect": {
                "query":{
                    "className":"iplfantasybids",
                },
                "key": "objectId"
            }
        },"league":league
    }),"order":"-updatedAt,-bidamount,priority","limit":300});

    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/bidhistory?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    #result = json.loads(connection.getresponse().read())
    return json.loads(connection.getresponse().read())

def viewUserBids(username,league):
    params = urllib.urlencode({"where":json.dumps({"username": username,"league":league, "priority": {"$ne": -1}}),
                               "order": "-bidamount,priority,-updatedAt","limit":100});
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplfantasybids?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    #result = json.loads(connection.getresponse().read())
    return json.loads(connection.getresponse().read())

def getBidPrority(username,amount):
    params = urllib.urlencode({"where":json.dumps({"username": username,"bidamount":amount, "priority": {"$ne": -1}}),
                               "order": "-priority", "limit":1});
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplfantasybids?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    print result
    if len(result["results"])>0:
        priority = result["results"][0]["priority"]+1
    else:
        priority = 1
    return priority

#Update the bid for the FA player
def enterFABid(bid,league,marketbid=0):
    if bid.get("priority") != -1:
        priority = getBidPrority(bid.get("username"),bid.get("bidAmount"))
    else:
        priority = -1

    bidentry={}
    bidentry["username"] = bid.get("username")
    bidentry["playertoaddobjectid"] = bid.get("newPlayer").get("objectId")
    bidentry["playertoaddid"] = bid.get("newPlayer").get("ID")
    bidentry["playertoaddname"] = bid.get("newPlayer").get("Name")
    bidentry["playertoaddtype"] = bid.get("newPlayer").get("Type")
    bidentry["playertodropobjectid"] = bid.get("playerTobeDropped").get("objectId")
    bidentry["playertodropid"] = bid.get("playerTobeDropped").get("ID")
    bidentry["playertodropname"] = bid.get("playerTobeDropped").get("Name")
    bidentry["playertodroptype"] = bid.get("playerTobeDropped").get("Type")
    bidentry["bidamount"] = bid.get("bidAmount")
    bidentry["priority"] = priority
    bidentry["playertodropteam"] = bid.get("playerTobeDropped").get("Team")
    bidentry["playertoaddteam"] = bid.get("newPlayer").get("Team")
    bidentry["league"] = bid.get("league")
    bidentry["marketbid"] = marketbid
    bidentry["bidresult"] = 0
    print bid.get("bidAmount")
    if(bid.get("bidAmount")<=0):
        print("negative bid amount!!")
        return

    params = urllib.urlencode({"where": json.dumps({"username": bidentry["username"], "playertoaddobjectid": bidentry["playertoaddobjectid"],"playertodropobjectid":bidentry["playertodropobjectid"]})})
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET', '/1/classes/iplfantasybids?%s' % params, '', {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M", "X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    if len(result.get("results")) > 0:
        operation = 'PUT'
        url = '/1/classes/iplfantasybids/%s' % result.get("results")[0].get("objectId")
    else:
        operation = 'POST'
        url = '/1/classes/iplfantasybids'


    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request(operation, url, json.dumps(bidentry), {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())

    return "Bid Updated"

def updateBids(bidlist,league):
    for bid in bidlist:
        connection = httplib.HTTPSConnection('api.parse.com',443)
        connection.connect()
        connection.request('PUT', '/1/classes/iplfantasybids/%s' % bid.get("objectId"), json.dumps(bid), {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    return "Bid Updated"

def processFABids(league):

    #clean up the bids.
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('POST','/1/functions/cleanBids',json.dumps({'postProcessing':False,'marketbid':0}),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())

    #group A
    currentStandings = getIplStanding(int(league))
    rankings = [item.get("name") for item in currentStandings]
    rankings.reverse()

    #getbids order by amount.
    params = urllib.urlencode({"where":json.dumps({"league":str(league),"marketbid":0, "bidresult":0, "priority":{'$ne': -1}}),
                               "order": "-bidamount,priority"})
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplfantasybids?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    bids = result.get("results")
    biders = list(set([item.get("username") for item in bids]))
    biddingUsers = []
    for user in biders:
        biddingUser={}
        connection = httplib.HTTPSConnection('api.parse.com',443)
        connection.connect()
        connection.request('POST','/1/functions/getPlayerDistribution',json.dumps({'name':user}),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
        result = json.loads(connection.getresponse().read())
        biddingUser["user"] = user
        biddingUser["distribution"] = result.get("result")
        biddingUser["rank"] = rankings.index(user)
        biddingUsers.append(biddingUser)

    bidindex=0
    bidsresult =[]
    bids.sort(key=operator.itemgetter('bidamount'), reverse=True)
    while len([item for item in bids if item["bidresult"] == 0]) > 0:
        bid=bids[0]
        if bid["bidresult"]!=0:
            continue
        similarBids = [item for item in bids if item["bidresult"]==0 and item["bidamount"]==bid["bidamount"]]
        if len(similarBids) > 1:
            minrank=rankings.index(bid["username"])
            for similarBid in similarBids:
                if rankings.index(similarBid["username"])<minrank:
                    minrank=rankings.index(similarBid["username"])
                    bid = similarBid
                if rankings.index(similarBid["username"])==minrank and similarBid["priority"]<bid["priority"]:
                    bid = similarBid

        #validate if user can do this bid.
        if validateUserBid(biddingUsers, bid) == False:
            bid["bidresult"] = 6
            bidsresult.append(bid)
            bids.remove(bid)
            continue
        else:
            userFantasyItem = [item for item in currentStandings if item["name"]==bid["username"]][0]
            if userFantasyItem["balance"] < bid["bidamount"]:
                bid["bidresult"] = 7
                bidsresult.append(bid)
                bids.remove(bid)
                continue

            bid["bidresult"] = 1
            userFantasyItem["balance"] -= bid["bidamount"]
            bidsresult.append(bid)
            bids.remove(bid)
            rankings.remove(bid["username"])
            rankings.append(bid["username"])


            otherUsersBids = [item for item in bids if item["playertoaddid"] == bid["playertoaddid"] and item["bidresult"]==0 and item["username"] != bid["username"]]
            for invalidBid in otherUsersBids:
                if invalidBid["bidamount"] < bid["bidamount"]:
                    invalidBid["bidresult"] = 2
                else:
                    invalidBid["bidresult"] = 3
                bidsresult.append(invalidBid)
                bids.remove(invalidBid)
            userInvalidBids = [item for item in bids if item["playertodropid"] == bid["playertodropid"] and item["bidresult"]==0 and item["username"] == bid["username"] and item["objectId"] != bid["objectId"]]
            for invalidBid in userInvalidBids:
                invalidBid["bidresult"] = 5
                bidsresult.append(invalidBid)
                bids.remove(invalidBid)

            userInvalidBids = [item for item in bids if item["playertoaddid"] == bid["playertoaddid"] and item["bidresult"]==0 and item["username"] == bid["username"] and item["objectId"] != bid["objectId"]]
            for invalidBid in userInvalidBids:
                invalidBid["bidresult"] = 4
                bidsresult.append(invalidBid)
                bids.remove(invalidBid)

    updateResults(bidsresult,currentStandings,int(league))
    #clean up the bids.
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('POST','/1/functions/cleanBids',json.dumps({'postProcessing':True,'marketbid':0}),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    return {"BidResult":bidsresult,"Standings":currentStandings}


def validateUserBid(biddingUsers, bid):

    if bid["playertoaddtype"] == bid["playertodroptype"]:
        return True

    userDistribution = [user["distribution"] for user in biddingUsers if user["user"]==bid["username"]][0]
    userDistribution[bid["playertoaddtype"]] += 1
    userDistribution[bid["playertodroptype"]] -= 1

    if userDistribution["Bat"] < 2:
        if userDistribution["Dummy"] >= (2-userDistribution["Bat"]):
            userDistribution["Dummy"] -= (2-userDistribution["Bat"])
            return True
        else:
            userDistribution[bid["playertoaddtype"]] -= 1
            userDistribution[bid["playertodroptype"]] += 1
            return False

    if userDistribution["Bowl"] < 2:
        if userDistribution["Dummy"] >= (2-userDistribution["Bowl"]):
            userDistribution["Dummy"] -= (2-userDistribution["Bowl"])
            return True
        else:
            userDistribution[bid["playertoaddtype"]] -= 1
            userDistribution[bid["playertodroptype"]] += 1
            return False

    if userDistribution["AR"] < 2:
        if userDistribution["Dummy"] >= (2-userDistribution["AR"]):
            userDistribution["Dummy"] -= (2-userDistribution["AR"])
            return True
        else:
            userDistribution[bid["playertoaddtype"]] -= 1
            userDistribution[bid["playertodroptype"]] += 1
            return False


    if userDistribution["WK"] < 1:
        if userDistribution["Dummy"] >= (1-userDistribution["WK"]):
            userDistribution["Dummy"] -= (1-userDistribution["WK"])
            return True
        else:
            userDistribution[bid["playertoaddtype"]] -= 1
            userDistribution[bid["playertodroptype"]] += 1
            return False

    return True

def updateResults(bidresults,currentStandings,league):
    if len(bidresults) == 0:
        return

    if league==1:
        owner = "owner1"
    else:
        owner = "owner2"

    queryList =[]
    for bidresult in bidresults:
        bidresultquery={
            "method":"PUT",
            "path":"/1/classes/iplfantasybids/"+bidresult["objectId"],
            "body":{
                "bidresult" : bidresult["bidresult"]
            }
        }

        queryList.append(bidresultquery)

        if bidresult["bidresult"]==1:
            bidprocessaddquery={
                "method":"PUT",
                "path":"/1/classes/iplplayer/"+bidresult["playertoaddobjectid"],
                "body":{
                    owner:bidresult["username"]
                }
            }
            bidprocessremovequery={
                "method":"PUT",
                "path":"/1/classes/iplplayer/"+bidresult["playertodropobjectid"],
                "body":{
                    owner:""
                }
            }
            queryList.append(bidprocessaddquery)
            queryList.append(bidprocessremovequery)

    for userStanding in currentStandings:
        standingquery={
            "method":"PUT",
            "path":"/1/classes/iplfantasy/"+userStanding["objectId"],
            "body":{
                "balance" : userStanding["balance"]
            }
        }

        queryList.append(standingquery)

    if len(queryList)==0:
        return

    for i in range(len(queryList)/50+1):
        queryToExecute = queryList[i*50:(i+1)*50]
        connection = httplib.HTTPSConnection('api.parse.com', 443)
        connection.connect()
        connection.request('POST', '/1/batch', json.dumps({
            "requests":queryToExecute}),{
            "X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M",
            "X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo",
            "Content-Type": "application/json"
        })
        result = json.loads(connection.getresponse().read())

def processMarketBids(league):
    #clean up the bids.
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('POST','/1/functions/cleanBids',json.dumps({'marketbid':1}),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())

    currentStandings = getIplStanding(int(league))
    rankings = [item.get("name") for item in currentStandings]
    rankings.reverse()



def addPlayerToTeam(userId,playerAddId,playerAddType,playerDropId,playerDropType,price):

    if playerAddType == playerDropType:
        replacePlayer(userId,playerAddId,playerDropId,price)


def replacePlayer(userId,playerAddId,playerdropId,price):
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('PUT','/1/classes/polloptions/%s'%playerAddId,json.dumps({"owner":userId,"Price":price}),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())

    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('PUT','/1/classes/polloptions/%s'%playerdropId,json.dumps({"owner":"","Price":0}),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())