import json,httplib,urllib
import urllib2
import requests
from pymongo import MongoClient
import os

mongodb = os.environ['MONGODB_STRING']

def saveUser(userObj):
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('POST','/1/classes/user',json.dumps(userObj),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    if userObj["tca_associated"] == "-1" :
        name=userObj["name"]
        send_mail("%s is requesting to join the Dukes XI Cricket Team" % (name),"cricketadmin@dukesxi.co",userObj.get("email"),"Permission to join Dukes XI Cricket Team")
    return result

def getUser(userName):
    result = queryUser("username",userName)
    return result

def getUsers():
    #r = requests.get('http://www.tennisballcricket.org/cricket_module/mobile_service.php?action=getTeamPlayers&tid=184')
    #tcaUsers = json.loads(r.text)
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    #params = urllib.urlencode({"where":json.dumps({key:value})})
    connection.request('GET','/1/classes/user','',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    return result

def getUserUsingTCAID(tca_id):
    result = queryUser("tca_id",tca_id)
    return result

def updateUser(userName,userObj,associate):
    existingUser = getUser(userName)
    if not existingUser.get("results"):
        abort(404)
    userid = existingUser.get("results")[0].get("objectId")
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('PUT','/1/classes/user/%s' % userid,json.dumps(userObj),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    if associate == "1" :
        name=existingUser.get("results")[0].get("name")
        tca_id=userObj.get("tca_id")
        send_mail("%s is requesting to associate TCA ID %s with his user id %s" % (name,tca_id,userName),"cricketadmin@dukesxi.co",userObj.get("email"),"Permission to assoicate TCA ID with user id")

    return result

def queryUser(key,value):
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    params = urllib.urlencode({"where":json.dumps({key:value})})
    connection.request('GET','/1/classes/user?%s' % params, '',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    return result
                  
def getUserSkill(user):
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    params = urllib.urlencode({"where":json.dumps({"username":user}),"keys":"tca_skillset"})
    connection.request('GET','/1/classes/user?%s' % params, '',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    return result.get("results")[0].get("tca_skillset")

def send_mail(message,to,cc,subject):
    print "Sending mail to %s" % to
    requests.post("https://api.mailgun.net/v2/dukesxi.co/messages",auth=("api","key-6juj8th780z4bbbf1jpl7ffpx5z34wa9"),data={"from":"Dukes XI <cricketteam@dukesxi.co>","to":to,"cc":cc,"subject":subject,"text":message})

def getUserHelper(key,value):
    client = MongoClient(mongodb)
    db = client.dukesxi
    userCursor = db.user.find({key:value})
    users = []
    for user in userCursor:
        users.append(user["email"])
    return users
