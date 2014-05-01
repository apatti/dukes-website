__author__ = 'apatti'
import json,httplib,urllib

def viewAllBids():
    params = urllib.urlencode({"where":json.dumps({
        "bidobjectid":{
            "$dontSelect": {
                "query":{
                    "className":"iplfantasybids",
                },
                "key": "objectId"
            }
        }
    }),"order":"-createdAt","limit":300});
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/bidhistory?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    #result = json.loads(connection.getresponse().read())
    return json.loads(connection.getresponse().read())

def viewUserBids(username):
    params = urllib.urlencode({"where":json.dumps({"username": username}),"order":"priority"});
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplfantasybids?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    #result = json.loads(connection.getresponse().read())
    return json.loads(connection.getresponse().read())


#Update the bid for the FA player
def enterFABid(bid):
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
    bidentry["priority"]=bid.get("priority")
    bidentry["playertodropteam"]=bid.get("playerTobeDropped").get("Team")
    bidentry["playertoaddteam"]=bid.get("newPlayer").get("Team")
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

    players = list(set([openbid["playertoaddname"] for openbid in openbids]))

    return players