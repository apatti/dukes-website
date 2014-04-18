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
        standing["battingpoints"]=sum([battingpoints for battingpoints in userscores])
        standing["bowlingpoints"]=sum([bowlingpoints for bowlingpoints in userscores])
        standing["fieldingpoints"]=sum([fieldingpoints for fieldingpoints in userscores])
        standing["mompoints"]=sum([mompoints for mompoints in userscores])
        standing["winpoints"]=sum([winpoints for winpoints in userscores])
        standing["win"]=sum([win for win in userscores])
        standing["loss"]=sum([loss for loss in userscores])
        standing["tie"]=sum([tie for tie in userscores])
        standings.append(standing)


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

