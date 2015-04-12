__author__ = 'apatti'
import json,httplib,urllib

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
    }),"order":"-bidamount,priority,-updatedAt","limit":300});

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
                               "order": "priority", "limit":1});
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplfantasybids?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    print result
    if 'priority' in result.results[0]:
        priority = result.results[0].priority+1
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
    bidentry["username"]=bid.get("username")
    bidentry["playertoaddobjectid"]=bid.get("newPlayer").get("objectId")
    bidentry["playertoaddid"]=bid.get("newPlayer").get("ID")
    bidentry["playertoaddname"]=bid.get("newPlayer").get("Name")
    bidentry["playertoaddtype"]=bid.get("newPlayer").get("Type")
    bidentry["playertodropobjectid"]=bid.get("playerTobeDropped").get("objectId")
    bidentry["playertodropid"]=bid.get("playerTobeDropped").get("ID")
    bidentry["playertodropname"]=bid.get("playerTobeDropped").get("Name")
    bidentry["playertodroptype"]=bid.get("playerTobeDropped").get("Type")
    bidentry["bidamount"]=bid.get("bidAmount")
    bidentry["priority"]=priority
    bidentry["playertodropteam"]=bid.get("playerTobeDropped").get("Team")
    bidentry["playertoaddteam"]=bid.get("newPlayer").get("Team")
    bidentry["league"]=bid.get("league")
    bidentry["marketbid"]=marketbid
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

def processFABids():
    #get the open bids
    params = urllib.urlencode({"order": "priority,playertoaddname"})
    connection = httplib.HTTPSConnection('api.parse.com', 443)
    connection.connect()
    connection.request('GET', '/1/classes/iplfantasybids?%s' % params, '', {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    bidresults = json.loads(connection.getresponse().read())
    if len(bidresults.get("results")) <= 0:
        return

    openbids = bidresults.get("results")
    resultbids=[]
    completed=[]
    backlog = list(set([openbid["playertoaddname"] for openbid in openbids]))

    for openbid in openbids:
        if openbid["playertoaddname"] in completed:
            continue
        #check if any other bid
        otherbids = [bid for bid in openbids if bid.get("playertoaddname")==openbid["playertoaddname"] ]
        if len(otherbids)<0:
            completed.append(openbid["playertoaddname"])
            resultbids.append(openbid)
            continue


    return [openbid["playertoaddname"] for openbid in openbids]

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