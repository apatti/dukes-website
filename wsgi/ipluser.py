import json,httplib,urllib
import urllib2
import requests
from dukesuser import *

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
