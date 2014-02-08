import json,httplib,urllib
import urllib2
import requests

connection = httplib.HTTPSConnection('api.parse.com',443)

def createPoll(pollObj,optObj):
    connection.connect()
    connection.request('POST','/1/classes/polls',json.dumps(pollObj),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    pollId = result.get("objectId")
    if not pollId:
        abort(400)
    #poll is created, populate the options table.
    for option in optObj:
        option["pollid"]=pollId
        connection.request('POST','/1/classes/polloptions',json.dumps(option),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
        connection.getresponse().read()
    return pollId

def getPoll(poll_id):
    connection.connect()
    connection.request('GET','/1/classes/polls/%s'%poll_id,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Con\
tent-Type": "application/json"})
    pollObj = json.loads(connection.getresponse().read())
    
    params = urllib.urlencode({"where":json.dumps({"pollid":poll_id})})
    connection.request('GET','/1/classes/polloptions?%s'%params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    options = json.loads(connection.getresponse().read())
    pollObj["options"]=options.get("results")

    return pollObj


def takePoll(poll_id,username,optid,prev_optid):
    
    if not prev_optid or prev_optid != '':
        #handle the old option.
        #TODO: Should handle this properly lateron.    
        connection.request('PUT','/1/classes/polloptions/%s'%prev_optid,json.dumps({"users":{"__op":"Remove","objects":[username]}}),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"}) 
    
    connection.request('PUT','/1/classes/polloptions/%s'%optionid,json.dumps({"users":{"__op":"AddUnique","objects":[username]}}),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"}) 
    result = json.loads(connection.getresponse().read())
    
    return result


def getPolls():
    connection.connect()
    connection.request('GET','/1/classes/polls','',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    pollsObj = json.loads(connection.getresponse().read()).get("results");
    print pollsObj
    for pollObj in pollsObj:
        params = urllib.urlencode({"where":json.dumps({"pollid":pollObj.get("objectId")})})
        connection.request('GET','/1/classes/polloptions?%s'%params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
        options = json.loads(connection.getresponse().read())
        pollObj["options"]=options.get("results")
    
    return pollsObj

    
