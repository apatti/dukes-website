__author__ = 'apatti'
import json,httplib,urllib
import urllib2
import requests

connection = httplib.HTTPSConnection('api.parse.com',443)

def getIplPlayers():
    params = urllib.urlencode({"order":"Type","limit":300});
    connection.connect()
    connection.request('GET','/1/classes/iplplayer?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    #result = json.loads(connection.getresponse().read())
    return json.loads(connection.getresponse().read())

def getIplAvailablePlayers():
    params = urllib.urlencode({"where":json.dumps({"owner": ""}),"order":"Type","limit":300});
    connection.connect()
    connection.request('GET','/1/classes/iplplayer?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    return json.loads(connection.getresponse().read())


def getIplUserAvailablePlayers(username):
    params = urllib.urlencode({"where":json.dumps({"owner": username}),"order":"Type","limit":300});
    connection.connect()
    connection.request('GET','/1/classes/iplplayer?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    userplayers = json.loads(connection.getresponse().read()).get("results")
    useravailableplayers = []
    availabletypes=['Batsman','Bowler','Wicket Keeper','All-Rounder']
    if len(userplayers)==11:
        return useravailableplayers

    if len(userplayers)>2:
        batsmancount = len([players for players in userplayers if players.get("Type")=='Batsman'])
        bowlercount = len([players for players in userplayers if players.get("Type")=='Bowler'])
        keepercount = len([players for players in userplayers if players.get("Type")=='Wicket Keeper'])
        allroundercount = len([players for players in userplayers if players.get("Type")=='All-Rounder'])
        if keepercount==4:
            availabletypes.remove('Wicket Keeper')
            if batsmancount==2:
                availabletypes.remove('Batsman')
            if bowlercount==3:
                availabletypes.remove('Bowler')
            if allroundercount==2:
                availabletypes.remove('All-Rounder')

        if batsmancount==5:
            availabletypes.remove('Batsman')
            if keepercount==1:
                availabletypes.remove('Wicket Keeper')
            if bowlercount==3:
                availabletypes.remove('Bowler')
            if allroundercount==2:
                availabletypes.remove('All-Rounder')

        if bowlercount==6:
            availabletypes.remove('Bowler')
            if batsmancount==2:
                availabletypes.remove('Batsman')
            if keepercount==1:
                availabletypes.remove('Wicket Keeper')
            if allroundercount==2:
                availabletypes.remove('All-Rounder')

        if allroundercount==5:
            availabletypes.remove('All-Rounder')
            if batsmancount==2:
                availabletypes.remove('Batsman')
            if bowlercount==3:
                availabletypes.remove('Bowler')
            if keepercount==1:
                availabletypes.remove('Wicket Keeper')

    print(availabletypes)
    params = urllib.urlencode({"where":json.dumps({"owner": "","Type":{"$in":availabletypes}}),"order":"Type","limit":300});
    connection.connect()
    connection.request('GET','/1/classes/iplplayer?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    return json.loads(connection.getresponse().read())
