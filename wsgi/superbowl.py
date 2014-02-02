import json,httplib,urllib
import urllib2
import requests

connection = httplib.HTTPSConnection('api.parse.com',443)
def insertSuperBowl(superbowlObj):
    obj = {}
    obj["username"]=superbowlObj.get("username")
    obj["firstquartertotal"]=superbowlObj.get("firstquartertotal")
    obj["secondquartertotal"]=superbowlObj.get("secondquartertotal")
    obj["thirdquartertotal"]=superbowlObj.get("thirdquartertotal")
    obj["fourthquartertotal"]=superbowlObj.get("fourthquartertotal")
    obj["finaltotal"]=superbowlObj.get("finaltotal")
    obj["firstquarterspread"]=superbowlObj.get("firstquarterspread")
    obj["secondquarterspread"]=superbowlObj.get("secondquarterspread")
    obj["thirdquarterspread"]=superbowlObj.get("thirdquarterspread")
    obj["fourthquarterspread"]=superbowlObj.get("fourthquarterspread")
    obj["finalspread"]=superbowlObj.get("finalspread")
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
