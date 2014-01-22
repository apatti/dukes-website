import json,httplib,urllib
import requests

connection = httplib.HTTPSConnection('api.parse.com',443)
def saveUser(userObj):
    connection.connect()
    connection.request('POST','/1/classes/user',json.dumps(userObj),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    return result

def getUser(userName):
    connection.connect()
    params = urllib.urlencode({"where":json.dumps({"username":userName})})
    connection.request('GET','/1/classes/user?%s' % params, '',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Cont\
ent-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    return result

def updateUser(userName,userObj,associate):
    existingUser = getUser(userName)
    if not existingUser.get("results"):
        abort(404)
    userid = existingUser.get("results")[0].get("objectId")
    userObj.set("associated")=0
    connection.connect()
    connection.request('PUT','/1/classes/user/%s' % userid,json.dumps(userObj),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    
    if associate == 1 :
        name=existingUser.get("results")[0].get("name")
        tca_id=userObj.get("tca_id")
        send_mail("%s is requesting to associate TCA ID %s with his user id %s" % (name,tca_id,userName),"cricketadmin@dukesxi.co",userObj.get("email"),"Permission to assoicate TCA ID with user id")

    return result
                      
def send_mail(message,to,cc,subject):
    requests.post("https://api.mailgun.net/v2/dukesxi.co/messages",auth=("api","key-6juj8th780z4bbbf1jpl7ffpx5z34wa9"),data={"from":"Dukes XI <cricketteam@dukesxi.co>","to":to,"cc":cc,"subject":subject,"text":message})
