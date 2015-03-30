__author__ = 'apatti'
import json,httplib,urllib
import urllib2
import requests

connection = httplib.HTTPSConnection('api.parse.com',443)

def getIplPlayers():
    params = urllib.urlencode({"order":"Type","limit":300});
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplplayer?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    #result = json.loads(connection.getresponse().read())
    return json.loads(connection.getresponse().read())

def getIplAvailablePlayers(leagueid):
    if leagueid=="1":
        owner="owner1"
    else:
        owner="owner2"
    params = urllib.urlencode({"where":json.dumps({owner: ""}),"order":"Type","limit":300});
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplplayer?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    return json.loads(connection.getresponse().read())


def getIplUserAvailablePlayers(username,leagueid):
    if leagueid=="1":
        owner="owner1"
    else:
        owner="owner2"
    params = urllib.urlencode({"where":json.dumps({owner: username}),"order":"Type","limit":300});
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplplayer?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    userplayers = json.loads(connection.getresponse().read()).get("results")
    useravailableplayers = []
    availabletypes=['Bat','Bowl','WK','AR']
    if len(userplayers)==11:
        return useravailableplayers

    if len(userplayers)>2:
        batsmancount = len([players for players in userplayers if players.get("Type")=='Bat'])
        bowlercount = len([players for players in userplayers if players.get("Type")=='Bowl'])
        keepercount = len([players for players in userplayers if players.get("Type")=='WK'])
        allroundercount = len([players for players in userplayers if players.get("Type")=='AR'])
        if keepercount==5:
            availabletypes.remove('WK')
            if batsmancount==2:
                availabletypes.remove('Bat')
            if bowlercount==2:
                availabletypes.remove('Bowl')
            if allroundercount==2:
                availabletypes.remove('AR')

        if batsmancount==6:
            availabletypes.remove('Bat')
            if keepercount==1:
                availabletypes.remove('WK')
            if bowlercount==2:
                availabletypes.remove('Bowl')
            if allroundercount==2:
                availabletypes.remove('AR')

        if bowlercount==6:
            availabletypes.remove('Bowl')
            if batsmancount==2:
                availabletypes.remove('Bat')
            if keepercount==1:
                availabletypes.remove('WK')
            if allroundercount==2:
                availabletypes.remove('AR')

        if allroundercount==6:
            availabletypes.remove('AR')
            if batsmancount==2:
                availabletypes.remove('Bat')
            if bowlercount==2:
                availabletypes.remove('Bowl')
            if keepercount==1:
                availabletypes.remove('WK')

    print(availabletypes)
    params = urllib.urlencode({"where":json.dumps({owner: "","Type":{"$in":availabletypes}}),"order":"Type","limit":300});
    connection.connect()
    connection.request('GET','/1/classes/iplplayer?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    return json.loads(connection.getresponse().read())


def getIplTeamPlayers(team):
    params = urllib.urlencode({"where":{"Team",team},"order":"Type","limit":300});
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplplayer?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    #result = json.loads(connection.getresponse().read())
    return json.loads(connection.getresponse().read())

def getIplTeamOwnedPlayers(team):
    params = urllib.urlencode({"where":json.dumps({"Team":team,"owner":{"$ne":""}}),"order":"Type","limit":300});
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplplayer?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
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