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
    playerscores = []
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
        fieldingpoints += fantasyScore["fieldingRunOut"]*10

        if fantasyScore["IsMoM"] is True:
            mompoints += 1
        if fantasyScore["IsWinner"] is True:
            winpoints += 1

        connection = httplib.HTTPSConnection('api.parse.com', 443)
        connection.connect()
        playerScoreObj ={}
        playerScoreObj["owner"]=fantasyScore["owner"]
        playerScoreObj["playerId"]=fantasyScore["ID"]
        playerScoreObj["playerName"]=fantasyScore["Name"]
        playerScoreObj["battingpoints"]=battingpoints
        playerScoreObj["bowlingpoints"]=bowlingpoints
        playerScoreObj["mompoints"]=mompoints
        playerScoreObj["winpoints"]=winpoints
        playerScoreObj["week"]=currentweeknumber
        playerScoreObj["fieldingpoints"]=fieldingpoints
        playerscores.append(playerScoreObj)
        connection.request('POST','/1/classes/iplfantasyplayerscore',json.dumps(playerScoreObj),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
        result = json.loads(connection.getresponse().read())

    # update user points
    iplusers = ['narashan','srudeep','rama.marri','balachandra.ambiga','vivek.vennam','gopi.k.mamidi','srikanth.kurmana','sagar.marri']
    userspoints=[]
    for ipluser in iplusers:
        battingpoints=0
        bowlingpoints=0
        fieldingpoints=0
        mompoints=0
        winpoints=0
        ipluserscores = [playerscore for playerscore in playerscores if playerscore.get("owner")==ipluser]
        for ipluserscore in ipluserscores:
            battingpoints+= ipluserscore["battingpoints"]
            bowlingpoints+= ipluserscore["bowlingpoints"]
            fieldingpoints+= ipluserscore["fieldingpoints"]
            mompoints+= ipluserscore["mompoints"]
            winpoints+= ipluserscore["winpoints"]

        userpoints = {}
        userpoints["owner"]=ipluser
        userpoints["week"]=currentweeknumber
        userpoints["battingpoints"]=battingpoints
        userpoints["bowlingpoints"]=bowlingpoints
        userpoints["fieldingpoints"]=fieldingpoints
        userpoints["mompoints"]=mompoints
        userpoints["winpoints"]=winpoints

        params = urllib.urlencode({"where": json.dumps({"owner": ipluser, "week": currentweeknumber})})
        connection = httplib.HTTPSConnection('api.parse.com',443)
        connection.connect()
        connection.request('GET', '/1/classes/iplfantasyuserscore?%s' % params, '', {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M", "X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
        result = json.loads(connection.getresponse().read())
        if len(result.get("results")) > 0:
            operation = 'PUT'
            userpoints["battingpoints"]+=result.get("results")[0].get("battingpoints")
            userpoints["bowlingpoints"]+=result.get("results")[0].get("bowlingpoints")
            userpoints["fieldingpoints"]+=result.get("results")[0].get("fieldingpoints")
            userpoints["mompoints"]+=result.get("results")[0].get("mompoints")
            userpoints["winpoints"]+=result.get("results")[0].get("winpoints")
            url = '/1/classes/iplfantasyuserscore/%s' % result.get("results")[0].get("objectId")
        else:
            operation = 'POST'
            url = '/1/classes/iplfantasyuserscore'

        connection = httplib.HTTPSConnection('api.parse.com',443)
        connection.connect()
        connection.request(operation, url, json.dumps(userpoints), {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
        result = json.loads(connection.getresponse().read())
        userpoints["objectId"]=result.get("objectId")
        userspoints.append(userpoints)

    #get the current schedule
    params = urllib.urlencode({"where": json.dumps({"fantasyweek": currentweeknumber})})
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET', '/1/classes/dukesiplfantasyschedule?%s' % params, '', {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M", "X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    games = (json.loads(connection.getresponse().read())).get("results")
    for game in games:
        team1 = game["team1"]
        team2 = game["team2"]

        params = urllib.urlencode({"where": json.dumps({"week": currentweeknumber,"owner":team1})})
        connection = httplib.HTTPSConnection('api.parse.com',443)
        connection.connect()
        connection.request('GET', '/1/classes/iplfantasyuserscore?%s' % params, '', {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M", "X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
        team1point = (json.loads(connection.getresponse().read())).get("results")[0]
        #team1point = [userpoint for userpoint in userspoints if userpoint["owner"]==team1][0]
        params = urllib.urlencode({"where": json.dumps({"week": currentweeknumber,"owner":team2})})
        connection = httplib.HTTPSConnection('api.parse.com',443)
        connection.connect()
        connection.request('GET', '/1/classes/iplfantasyuserscore?%s' % params, '', {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M", "X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
        team2point = (json.loads(connection.getresponse().read())).get("results")[0]
        #team2point = [userpoint for userpoint in userspoints if userpoint["owner"]==team2][0]

        team1win =0
        team1loss=0
        team2win =0
        team2loss=0
        team1tie=0
        team2tie=0

        if team1point["battingpoints"]>team2point["battingpoints"]:
            team1win+=1
            team2loss+=1
        if team1point["battingpoints"]<team2point["battingpoints"]:
            team2win+=1
            team1loss+=1
        if team1point["battingpoints"]==team2point["battingpoints"]:
            team1tie+=1
            team2tie+=1

        if team1point["bowlingpoints"]>team2point["bowlingpoints"]:
            team1win+=1
            team2loss+=1
        if team1point["bowlingpoints"]<team2point["bowlingpoints"]:
            team2win+=1
            team1loss+=1
        if team1point["bowlingpoints"]==team2point["bowlingpoints"]:
            team1tie+=1
            team2tie+=1

        if team1point["fieldingpoints"]>team2point["fieldingpoints"]:
            team1win+=1
            team2loss+=1
        if team1point["fieldingpoints"]<team2point["fieldingpoints"]:
            team2win+=1
            team1loss+=1
        if team1point["fieldingpoints"]==team2point["fieldingpoints"]:
            team1tie+=1
            team2tie+=1

        if team1point["mompoints"]>team2point["mompoints"]:
            team1win+=1
            team2loss+=1
        if team1point["mompoints"]<team2point["mompoints"]:
            team2win+=1
            team1loss+=1
        if team1point["mompoints"]==team2point["mompoints"]:
            team1tie+=1
            team2tie+=1

        if team1point["winpoints"]>team2point["winpoints"]:
            team1win+=1
            team2loss+=1
        if team1point["winpoints"]<team2point["winpoints"]:
            team2win+=1
            team1loss+=1
        if team1point["winpoints"]==team2point["winpoints"]:
            team1tie+=1
            team2tie+=1

        if currentweeknumber==5:
            team1win*=2
            team1loss*=2
            team1tie*=2
            team2win*=2
            team2loss*=2
            team2tie*=2

        scorejsonobj = {"win":team1win,"loss":team1loss,"tie":team1tie}
        connection = httplib.HTTPSConnection('api.parse.com',443)
        connection.connect()
        connection.request('PUT', '/1/classes/iplfantasyuserscore/%s'%team1point["objectId"], json.dumps(scorejsonobj), {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
        result = json.loads(connection.getresponse().read())

        scorejsonobj = {"win":team2win,"loss":team2loss,"tie":team2tie}
        connection = httplib.HTTPSConnection('api.parse.com',443)
        connection.connect()
        connection.request('PUT', '/1/classes/iplfantasyuserscore/%s'%team2point["objectId"], json.dumps(scorejsonobj), {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
        result = json.loads(connection.getresponse().read())

    return result
