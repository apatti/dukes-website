__author__ = 'apatti'
import json,httplib,urllib
import urllib2
import requests

connection = httplib.HTTPSConnection('api.parse.com',443)

def getIplPlayers():
    params = urllib.urlencode({"order":"Type","limit":300});
    connection.connect()
    connection.request('GET','/1/classes/iplplayers?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    #result = json.loads(connection.getresponse().read())
    return json.loads(connection.getresponse().read())

def getIplAvailablePlayers():
    params = urllib.urlencode({"where":json.dumps({"owner": ""}),"order":"Type","limit":300});
    connection.connect()
    connection.request('GET','/1/classes/iplplayers?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    return json.loads(connection.getresponse().read())


def getIplUserAvailablePlayers(username):
    params = urllib.urlencode({"where":json.dumps({"owner": username}),"order":"Type","limit":300});
    connection.connect()
    connection.request('GET','/1/classes/iplplayers?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    userplayers = json.loads(connection.getresponse().read()).get("results")
    useravailableplayers = []
    availabletypes=['Batsman','Bowler','Wicket Keeper','All-Rounder']
    if userplayers.len()==9:
        return useravailableplayers

    if userplayers.len()>2:
        batsmancount = [players for players in userplayers if players.get("Type")=='Batsman'].count()
        bowlercount = [players for players in userplayers if players.get("Type")=='Bowler'].count()
        keepercount = [players for players in userplayers if players.get("Type")=='Wicket Keeper'].count()
        allroundercount = [players for players in userplayers if players.get("Type")=='All-Rounder'].count()
        if keepercount==3:
            availabletypes.remove('Wicket Keeper')
            if batsmancount==2:
                availabletypes.remove('Batsman')
            if bowlercount==2:
                availabletypes.remove('Bowler')
            if allroundercount==2:
                availabletypes.remove('All-Rounder')

        if batsmancount==4:
            availabletypes.remove('Batsman')
            if keepercount==1:
                availabletypes.remove('Wicket Keeper')
            if bowlercount==2:
                availabletypes.remove('Bowler')
            if allroundercount==2:
                availabletypes.remove('All-Rounder')

        if bowlercount==4:
            availabletypes.remove('Bowler')
            if batsmancount==2:
                availabletypes.remove('Batsman')
            if keepercount==1:
                availabletypes.remove('Wicket Keeper')
            if allroundercount==2:
                availabletypes.remove('All-Rounder')

        if allroundercount==4:
            availabletypes.remove('All-Rounder')
            if batsmancount==2:
                availabletypes.remove('Batsman')
            if bowlercount==2:
                availabletypes.remove('Bowler')
            if keepercount==1:
                availabletypes.remove('Wicket Keeper')

    params = urllib.urlencode({"where":json.dumps({"owner": "","Type":{"$all":availabletypes}}),"order":"Type","limit":300});
    connection.connect()
    connection.request('GET','/1/classes/iplplayers?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    return json.loads(connection.getresponse().read())
