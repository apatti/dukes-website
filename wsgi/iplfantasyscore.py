__author__ = 'apatti'

import json,httplib,urllib
import re

def updateFantasyScore(iplTeamScoreObj):

    #get current fantasyweek
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplfantasycurrentweek/mJkDqrQ19R','',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Con\
tent-Type": "application/json"})
    currentweeknumber = json.loads(connection.getresponse().read()).get("currentweeknumber")

    for fantasyScore in iplTeamScoreObj:
        battingpoints = 0
        bowlingpoints = 0
        fieldingpoints = 0
        mompoints = 0
        winpoints = 0

        battingpoints += fantasyScore["battingRuns"]
        battingpoints += fantasyScore["sixs"]*2

        if fantasyScore["battingRuns"] >= 25 and fantasyScore["battingRuns"] < 50:
            battingpoints += 25
        if fantasyScore["battingRuns"] >= 50 and fantasyScore["battingRuns"] < 75:
            battingpoints += 50
        if fantasyScore["battingRuns"] >= 75 and fantasyScore["battingRuns"] < 100:
            battingpoints += 75
        if fantasyScore["battingRuns"] >= 100:
            battingpoints += 100

        if fantasyScore["battingRuns"]>fantasyScore["battingBalls"] :
            battingpoints += (fantasyScore["battingRuns"]-fantasyScore["battingBalls"])

        bowlingpoints += fantasyScore["bowlingWickets"]*20
        bowlingpoints += fantasyScore["bowlingMaidenOvers"]*20

        if fantasyScore["noOfBalls"] > fantasyScore["bowlingRuns"]:
            bowlingpoints += ((fantasyScore["noOfBalls"]-fantasyScore["bowlingRuns"])*4)
        if fantasyScore["bowlingWickets"] >= 2:
            bowlingpoints += fantasyScore["bowlingWickets"]*10

        fieldingpoints += fantasyScore["fieldingCatches"]*10
        fieldingpoints += fantasyScore["fieldingStumping"]*15
        fieldingpoints += fantasyScore["directRunOut"]*15
        fieldingpoints += fantasyScore["fieldingRunOut"]*15

        if fantasyScore["IsMoM"] is True:
            mompoints += 1
        if fantasyScore["IsWinner"] is True:
            winpoints += 1

        connection = httplib.HTTPSConnection('api.parse.com', 443)
        connection.connect()
        playerScoreObj ={}
        playerScoreObj["owner"]=fantasyScore["owner"]
        playerScoreObj["playerId"]=fantasyScore["objectId"]
        playerScoreObj["playerId"]=fantasyScore["ID"]
        playerScoreObj["playerName"]=fantasyScore["Name"]
        playerScoreObj["battingpoints"]=battingpoints
        playerScoreObj["bowlingpoints"]=bowlingpoints
        playerScoreObj["mompoints"]=mompoints
        playerScoreObj["winpoints"]=winpoints
        playerScoreObj["week"]=currentweeknumber
        playerScoreObj["fieldingpoints"]=fieldingpoints

        connection.request('POST','/1/classes/iplfantasyplayerscore',json.dumps(playerScoreObj),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
        result = json.loads(connection.getresponse().read())

    return result
