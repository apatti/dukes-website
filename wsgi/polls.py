import json,httplib,urllib
import urllib2
import requests

connection = httplib.HTTPSConnection('api.parse.com',443)

def createPoll(pollObj):
    connection.connect()
    connection.request('POST','/1/classes/polls',json.dumps(pollObj),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    return result

def getPoll(poll_id):
    connection.connect()
    connection.request('GET','/1/classes/polls/%s'%poll_id,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Con\
tent-Type": "application/json"})
    return json.loads(connection.getresponse().read())

def takePoll(poll_id,pollObj,optObj):
    for opt in pollObj.options:
        if opt.get("id")==optObj.get("id"):
            opt["users"].append(optObj.userName);
            connection.request('PUT','/1/classes/polls/%s'%poll_id,json.dumps(opt),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
            result = json.loads(connection.getresponse().read())
            return result
    
    return json.loads(pollObj)
