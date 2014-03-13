__author__ = 'apatti'

import json,httplib,urllib
import urllib2
import requests

connection = httplib.HTTPSConnection('api.parse.com',443)

def createFantasyTeam(fantasyTeamObj):

    connection.connect()
    connection.request('POST', '/1/classes/dukesfantasyteam',json.dumps(fantasyTeamObj), {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())

    return "ok"


def getAllFantasyTeams():
    connection.connect()
    connection.request('GET', '/1/classes/dukesfantasyteam','', {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())

    return result

def updateFantasyScore(gameid,fantasyTeamScoreObj):
    for fantasyScore in fantasyTeamScoreObj:
        battingpoints = 0
        battingbonuspoints = 0
        bowlingpoints = 0
        bowlingbonuspoints = 0
        fieldingpoints = 0
        mompoints = 0
        srr = 0.0

        battingpoints += fantasyScore["battingRuns"]*2
        if (fantasyScore["notOut"] is True) and (fantasyScore["battingRuns"] >= 10):
            battingbonuspoints += 10
        if (fantasyScore["battingRuns"] >= 15) and (fantasyScore["battingRuns"] < 25):
            battingbonuspoints += 15
        if (fantasyScore["battingRuns"] >=25) and (fantasyScore["battingRuns"] < 50):
            battingbonuspoints += 25
        if (fantasyScore["battingRuns"] >= 50) and (fantasyScore["battingRuns"] < 75):
            battingbonuspoints += 50
        if (fantasyScore["battingRuns"] >= 75) and (fantasyScore["battingRuns"] < 100):
            battingbonuspoints += 75
        if fantasyScore["battingRuns"] >= 100:
            battingbonuspoints += 100

        if fantasyScore["battingRuns"] >= 10:
            srr = fantasyScore["battingRuns"]/fantasyScore["battingBalls"]
        if (srr >= 75) and (srr < 95):
            battingbonuspoints += 15
        if (srr >= 95) and (srr < 115):
            battingbonuspoints += 30
        if srr >= 115:
            battingbonuspoints += 50

        bowlingpoints += fantasyScore["bowlingWickets"]*20
        bowlingpoints += fantasyScore["bowlingMaidenOvers"]*10

        if fantasyScore["bowlingWickets"] == 2:
            bowlingbonuspoints += 15
        if (fantasyScore["bowlingWickets"] >= 3) and (fantasyScore["bowlingWickets"] <= 4):
            bowlingbonuspoints += 30
        if fantasyScore["bowlingWickets"] == 5:
            bowlingbonuspoints += 50
        if fantasyScore["bowlingWickets"] == 6:
            bowlingbonuspoints += 75
        if fantasyScore["bowlingWickets"] >= 7:
            bowlingbonuspoints += 100
        if fantasyScore["bowlingExtras"] == 0:
            bowlingbonuspoints += 20
        if fantasyScore["bowlingEconomy"] <= 2.5:
            bowlingbonuspoints += 50
        if (fantasyScore["bowlingEconomy"] > 2.5) and (fantasyScore["bowlingWickets"] <= 3.5):
            bowlingbonuspoints += 30

        fieldingpoints += fantasyScore["fieldingCatches"]*20
        fieldingpoints += fantasyScore["fieldingStumping"]*20
        fieldingpoints += fantasyScore["fieldingRunOut"]*10

        if fantasyScore["IsMoM"] is True:
            mompoints += 50

        points = battingpoints+battingbonuspoints+bowlingpoints+bowlingbonuspoints+fieldingpoints+mompoints
        #TODO update the player.
        params = urllib.urlencode({"where": json.dumps({"player":fantasyScore["player"], "gameid": gameid})})
        connection.connect()
        connection.request('GET', '/1/classes/dukesfantasyscore?%s' % params, '',
                           {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M", "X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
        result = json.loads(connection.getresponse().read())
        if len(result.get("results")) > 0:
            operation = 'PUT'
            url = '/1/classes/dukesfantasyscore/%s' % result.get("results")[0].get("objectId")
        else:
            operation = 'POST'
            url = '/1/classes/dukesfantasyscore'

        scorejsonobj = {"player": fantasyScore["player"], "gameid": gameid, "points": points, "battingpoints": battingpoints, "battingbonuspoints": battingbonuspoints, "bowlingpoints": bowlingpoints, "bowlingbonuspoints": bowlingbonuspoints, "fieldingpoints": fieldingpoints, "mompoints": mompoints}
        connection.connect()
        connection.request(operation, url, json.dumps(scorejsonobj), {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    return "ok"