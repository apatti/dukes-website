import json,httplib,urllib
import urllib2
import requests

connection = httplib.HTTPSConnection('api.parse.com',443)

def createPoll(pollObj,optObj):
    print pollObj
    print optObj
    connection.connect()
    connection.request('POST','/1/classes/polls',json.dumps(pollObj),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    pollId = result.get("objectId")
    if not pollId:
        abort(400)
    print pollId
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


def takePoll(poll_id,pollObj,optObj):
    for opt in pollObj.get('options'):
        if opt.get("id")==optObj.get("id"):
            print opt
            users = opt.get("users",[])
            users.append(optObj.get('username'))
            opt["users"]=users
            print json.dumps(opt)
            connection.request('PUT','/1/classes/polls/%s'%poll_id,json.dumps({"options":{"__op":"Add","objects":opt}}),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
            result = json.loads(connection.getresponse().read())
            return result
    
    return pollObj


def getPolls():
    connection.connect()
    connection.request('GET','/1/classes/polls','',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    pollsObj = json.loads(connection.getresponse().read())
    for pollObj in pollsObj:
        print pollObj
        print json.loads(pollObj)
        params = urllib.urlencode({"where":json.dumps({"pollid":pollObj.objectId]})})
        connection.request('GET','/1/classes/polloptions?%s'%params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
        options = json.loads(connection.getresponse().read())
        pollObj["options"]=options.get("results")
    
    return pollsObj

    
