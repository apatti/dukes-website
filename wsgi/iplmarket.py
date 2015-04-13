__author__ = 'apatti'
import json,httplib,urllib
from dukesMail import send_mail_ipl

def viewAllMarket(league):
    params = urllib.urlencode({"where":json.dumps({
        "league":int(league),"marketPrice": {"$ne": -1}
    }),"order":"-createdAt","limit":300});

    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplmarket?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    #result = json.loads(connection.getresponse().read())
    return json.loads(connection.getresponse().read())

def viewUserMarket(league,username):
    params = urllib.urlencode({"where":json.dumps({"username": username,
        "league":int(league),"marketPrice": {"$ne": -1}
    }),"order":"-createdAt","limit":300});

    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplmarket?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    #result = json.loads(connection.getresponse().read())
    return json.loads(connection.getresponse().read())


def cancelMarket(marketid):
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('DELETE', '/1/classes/iplmarket/%s' % marketid, '', {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})

    return "Market Updated"

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
        update=1
    else:
        operation = 'POST'
        url = '/1/classes/iplmarket'
        update=0


    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request(operation, url, json.dumps(marketentry), {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())

    message = marketAddMailMessage(market.get("playername"), market.get("playerType"),
                                   market.get("playerTeam"), market.get("username"), market.get("marketPrice"),
                                   league, update)

    send_mail_ipl(message,"", "Dukes IPL Fantasy - Market Action")

    return "Market Updated"

def marketAddMailMessage(playername, playertype, playerteam, user, price, league, update=0):
    message=""

    if update==0:
        message=message+"A new player has been added to the Market\n"
    if update==1:
        message=message+"Market player has been updated\n"
    if update==-1:
        message=message+"Market player has been deleted\n"


    if league == 1:
        league = "A"
    else:
        league = "B"

    message = message+"\nGroup:\n\t\t%s\n" % league
    message = message+"\nName:\n\t\t%s\n" % playername
    message = message+"\nType:\t\t%s\n" % playertype
    message = message+"\nTeam:\t\t%s\n" % playerteam
    message = message+"\nPrice:\t\t$%d\n" % price
    message = message+"\nOwner:\t\t%s\n" % user
    message = message+"\n--\nDukes IPL Fantasy Admin"

    return message;