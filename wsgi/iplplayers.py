__author__ = 'apatti'
import json,httplib,urllib
import urllib2
import requests

connection = httplib.HTTPSConnection('api.parse.com',443)

def getIplPlayers():
    connection.connect()
    connection.request('GET','/1/classes/iplplayers','',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    #result = json.loads(connection.getresponse().read())
    return json.loads(connection.getresponse().read())

def getIplAvailablePlayers():
    params = urllib.urlencode({"where":json.dumps({"owner": {"$exists": True},"$ne":""})});
    connection.connect()
    connection.request('GET','/1/classes/iplplayers?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    return json.loads(connection.getresponse().read())