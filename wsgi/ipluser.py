import json,httplib,urllib
import urllib2
import requests
from dukesuser import *

users = ["cxau7SUk30","cQyLG8Hfcx","S09xDQIAwx","cVludKMtrM","ifknpQHlOZ","FTi5d6xY8p","6lKxqUiuNz","Znu89ws97j"]
currentBidIndex = -1
currentUser = ""

connection = httplib.HTTPSConnection('api.parse.com',443)
def saveIPLUser(userName,userTeam,userEmail):
    userObj = {}
    userObj["iplteam"]=userTeam
    userObj["email"]=userEmail
    return updateUser(userName,userObj,0)

def getIplUsers():
    params = urllib.urlencode({"order" : "-createdAt"})
    connection.connect()
    connection.request('GET','/1/classes/iplfantasy?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    #result = json.loads(connection.getresponse().read())
    return json.loads(connection.getresponse().read())

def getIplUserTeam(username):
    params = urllib.urlencode({"where":json.dumps({"owner":username})})
    connection.connect()
    connection.request('GET','/1/classes/iplplayer?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    return json.loads(connection.getresponse().read())

def getNextBidder():
    global users
    global currentBidIndex
    global currentUser
    global connection

    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplbidindex','',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read()).get("results")[0]
    bidindex = result.get("index")
    totalPlayers = result.get("totalplayers")
    bidindex = bidindex % totalPlayers
    if bidindex != currentBidIndex:
        params = urllib.urlencode({"where":json.dumps({"bidindex":bidindex})})
        connection = httplib.HTTPSConnection('api.parse.com',443)
        connection.connect()
        connection.request('GET','/1/classes/iplfantasy?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
        currentUser = json.loads(connection.getresponse().read()).get("results")[0]
        currentBidIndex = bidindex

    return currentUser
