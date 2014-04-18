__author__ = 'apatti'
import json,httplib,urllib
import urllib2
import requests


def getIplStanding():
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplfantasyuserscore?','',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    usersscores = result.get("results")

    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplfantasy?','',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    users = result.get("results")

    #users = ['narashan','srudeep','rama.marri','balachandra.ambiga','vivek.vennam','gopi.k.mamidi','srikanth.kurmana','sagar.marri']
    standings=[]
    for user in users:
        userscores = [userscore for userscore in usersscores if userscore["owner"]==user["username"]]

        #standing={}
        #standing["owner"]=user
        user["battingpoints"]=sum([userscore["battingpoints"] for userscore in userscores])
        user["bowlingpoints"]=sum([userscore["bowlingpoints"] for userscore in userscores])
        user["fieldingpoints"]=sum([userscore["fieldingpoints"] for userscore in userscores])
        user["mompoints"]=sum([userscore["mompoints"] for userscore in userscores])
        user["winpoints"]=sum([userscore["winpoints"] for userscore in userscores])
        user["win"]=sum([userscore["win"] for userscore in userscores])
        user["loss"]=sum([userscore["loss"] for userscore in userscores])
        user["tie"]=sum([userscore["tie"] for userscore in userscores])
        standings.append(user)

    #sorted(standings,key=)
    return standings

def getIplCurrentWeekStanding():
    #get current fantasyweek
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplfantasycurrentweek/mJkDqrQ19R','',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Con\
tent-Type": "application/json"})
    currentweeknumber = json.loads(connection.getresponse().read()).get("currentweeknumber")

    #get the current schedule
    params = urllib.urlencode({"where": json.dumps({"fantasyweek": currentweeknumber})})
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET', '/1/classes/dukesiplfantasyschedule?%s' % params, '', {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M", "X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    games = (json.loads(connection.getresponse().read())).get("results")

    params = urllib.urlencode({"week":currentweeknumber})
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplfantasyuserscore?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    weeklyscores=(json.loads(connection.getresponse().read())).get("results")

    #for game in games:
