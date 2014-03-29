import json,httplib,urllib
import urllib2
import requests
from dukesuser import *

users = ["cQyLG8Hfcx","Znu89ws97j","KhW6emiPgo","N1SyxyhKPb","ifknpQHlOZ","S09xDQIAwx","FTi5d6xY8p","cxau7SUk30","6lKxqUiuNz","cVludKMtrM"]

connection = httplib.HTTPSConnection('api.parse.com',443)
def saveIPLUser(userName,userTeam,userEmail):
    userObj = {}
    userObj["iplteam"]=userTeam
    userObj["email"]=userEmail
    return updateUser(userName,userObj,0)

def getIplUsers():
    params = urllib.urlencode({"order" : "teamname"})
    connection.connect()
    connection.request('GET','/1/classes/iplfantasy?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    #result = json.loads(connection.getresponse().read())
    return json.loads(connection.getresponse().read())

def getIplUserTeam(username):
    params = urllib.urlencode({"where":json.dumps({"owner":username})})
    connection.connect()
    connection.request('GET','/1/classes/iplplayers?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    return json.loads(connection.getresponse().read())


def getNextBidder():
    params = urllib.urlencode({"order":"teamname"});
    connection.connect()
    connection.request('GET','/1/classes/iplplayers?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    iplusers = json.loads(connection.getresponse().read()).results;
    for ipluser in iplusers:
        if(ipluser.get("iscurrentplayer")==True):
            index = users.index(ipluser.get("objectId"));
            index = index+1
            if(index==9):
                index=0
    connection.connect()
    connection.request('PUT', '/1/classes/iplplayers/'+iplusers[index].get("objectid"), json.dumps({
        "iscurrentplayer": True
        }), {
        "X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M",
        "X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo",
        "Content-Type": "application/json"
        })
    result = json.loads(connection.getresponse().read())

    return iplusers[index].get("username")

