__author__ = 'apatti'
import json,httplib,urllib
import urllib2
import requests


def getIplStanding(leagueId):
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplfantasyuserscore?','',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    usersscores = result.get("results")

    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    params = urllib.urlencode({"where":json.dumps({"league":leagueId})})
    connection.request('GET','/1/classes/iplfantasy?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    users = result.get("results")

    standings=[]
    for user in users:
        userscores = [userscore for userscore in usersscores if userscore["owner"]==user["username"]]

        #standing={}
        #standing["owner"]=user
        user["battingpoints"]=sum([userscore["battingpoints"] for userscore in userscores])
        user["bowlingpoints"]=sum([userscore["bowlingpoints"] for userscore in userscores])
        user["fieldingpoints"]=sum([userscore["fieldingpoints"] for userscore in userscores])
        user["mompoints"]=sum([userscore["mompoints"] for userscore in userscores])
        user["winnerpoints"]=sum([userscore["winpoints"] for userscore in userscores])
        user["wins"]=sum([userscore["win"] for userscore in userscores])
        user["loss"]=sum([userscore["loss"] for userscore in userscores])
        user["ties"]=sum([userscore["tie"] for userscore in userscores])
        standings.append(user)

    #sorted(standings,key=)
    standings.sort(key=lambda x:x["mompoints"],reverse=True)
    standings.sort(key=lambda x:x["winnerpoints"],reverse=True)
    standings.sort(key=lambda x:x["ties"],reverse=True)
    standings.sort(key=lambda x:x["loss"])
    standings.sort(key=lambda x:x["wins"],reverse=True)
    return standings

def getIplCurrentWeekStanding():
    #get current fantasyweek
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplfantasycurrentweek/mJkDqrQ19R','',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Con\
tent-Type": "application/json"})
    weekresult =json.loads(connection.getresponse().read())
    currentweeknumber = weekresult.get("currentweeknumber")
    weekname = weekresult.get("weekname")
    weekduration = weekresult.get("Duration")

    #get the current schedule
    params = urllib.urlencode({"where": json.dumps({"fantasyweek": currentweeknumber})})
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET', '/1/classes/dukesiplfantasyschedule?%s' % params, '', {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M", "X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    games = (json.loads(connection.getresponse().read())).get("results")

    params = urllib.urlencode({"where": json.dumps({"week": currentweeknumber})})
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplfantasyuserscore?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    weeklyscores=(json.loads(connection.getresponse().read())).get("results")
    print("Week:"+str(currentweeknumber));
    print(weeklyscores);
    currentSchedule={}
    currentSchedule["weekname"]=weekname
    currentSchedule["weekduration"]=weekduration
    gamesscores=[]
    for game in games:
        team1 = game["team1"]
        team2 = game["team2"]

        team1scores = [userscore for userscore in weeklyscores if userscore["owner"]==team1]
        team2scores = [userscore for userscore in weeklyscores if userscore["owner"]==team2]
        gamescore={}
        if len(team1scores)>0:
            gamescore["team1"]=team1scores[0]
        else:
            blankscoreobj={}
            blankscoreobj["owner"]=team1
            blankscoreobj["battingpoints"]=0
            blankscoreobj["bowlingpoints"]=0
            blankscoreobj["fieldingpoints"]=0
            blankscoreobj["mompoints"]=0
            blankscoreobj["winpoints"]=0
            blankscoreobj["tie"]=0
            blankscoreobj["loss"]=0
            blankscoreobj["win"]=0
            gamescore["team1"]=blankscoreobj

        if len(team2scores)>0:
            gamescore["team2"]=team2scores[0]
        else:
            blankscoreobj={}
            blankscoreobj["owner"]=team2
            blankscoreobj["battingpoints"]=0
            blankscoreobj["bowlingpoints"]=0
            blankscoreobj["fieldingpoints"]=0
            blankscoreobj["mompoints"]=0
            blankscoreobj["winpoints"]=0
            blankscoreobj["tie"]=0
            blankscoreobj["loss"]=0
            blankscoreobj["win"]=0
            gamescore["team2"]=blankscoreobj

        gamesscores.append(gamescore)

    currentSchedule["games"]=gamesscores
    return currentSchedule

