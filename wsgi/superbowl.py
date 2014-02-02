import json,httplib,urllib
import urllib2
import requests

connection = httplib.HTTPSConnection('api.parse.com',443)
def insertSuperBowl(superbowlObj):
    print(superbowlObj)
    connection.connect()
    connection.request('POST','/1/classes/superbowl',json.dumps(superbowlObj),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    return result

def getSuperBowl():
    connection.connect()
    connection.request('GET','/1/classes/superbowl','',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    return result
