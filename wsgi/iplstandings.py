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
    users = ['narashan','srudeep','rama.marri','balachandra.ambiga','vivek.vennam','gopi.k.mamidi','srikanth.kurmana','sagar.marri']
    standings=[]
    for user in users:
        userscores = [userscore for userscore in usersscores if userscore["owner"]==user]

        standing={}
        standing["owner"]=user
        standing["battingpoints"]=sum([userscore["battingpoints"] for userscore in userscores])
        standing["bowlingpoints"]=sum([userscore["bowlingpoints"] for userscore in userscores])
        standing["fieldingpoints"]=sum([userscore["fieldingpoints"] for userscore in userscores])
        standing["mompoints"]=sum([userscore["mompoints"] for userscore in userscores])
        standing["winpoints"]=sum([userscore["winpoints"] for userscore in userscores])
        standing["win"]=sum([userscore["win"] for userscore in userscores])
        standing["loss"]=sum([userscore["loss"] for userscore in userscores])
        standing["tie"]=sum([userscore["tie"] for userscore in userscores])
        standings.append(standing)

    print standings
    #sorted(standings,key=)
    return standings

def getIplCurrentWeekStanding():
    #get current fantasyweek
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplfantasycurrentweek/mJkDqrQ19R','',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Con\
tent-Type": "application/json"})
    currentweeknumber = json.loads(connection.getresponse().read()).get("currentweeknumber")


    params = urllib.urlencode({"week":currentweeknumber})
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplfantasyuserscore?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})

