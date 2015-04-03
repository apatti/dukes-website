__author__ = 'apatti'
import json,httplib,urllib

def viewAllMarket(league):
    params = urllib.urlencode({"where":json.dumps({
        "league":league
    }),"order":"-createdAt","limit":300});

    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplmarket?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    #result = json.loads(connection.getresponse().read())
    return json.loads(connection.getresponse().read())

def enterMarket(market,league):
    marketentry={}
    marketentry["username"]=market.get("username")
    marketentry["playerObjectId"]=market.get("playerObjectId")
    marketentry["playername"]=market.get("playername")
    marketentry["playerType"]=market.get("playerType")
    marketentry["marketPrice"]=market.get("marketPrice")
    marketentry["playerTeam"]=market.get("playerTeam")
    marketentry["league"]=market.get("league")
    marketentry["playerImageLink"]=market.get("playerImageLink")
    marketentry["playerNameLink"]=market.get("playerNameLink")

    params = urllib.urlencode({"where": json.dumps({"username": market["username"], "playerObjectId": market["playerObjectId"]})})
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET', '/1/classes/iplmarket?%s' % params, '', {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M", "X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    if len(result.get("results")) > 0:
        operation = 'PUT'
        url = '/1/classes/iplmarket/%s' % result.get("results")[0].get("objectId")
    else:
        operation = 'POST'
        url = '/1/classes/iplmarket'


    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request(operation, url, json.dumps(marketentry), {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())

    return "Market Updated"
