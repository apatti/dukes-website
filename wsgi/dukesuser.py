import json,httplib,urllib
import urllib2
import requests
from pymongo import MongoClient
import os

if 'MONGODB_STRING' in os.environ:
    mongodb = os.environ['MONGODB_STRING']
else:
    mongodb = 'mongodb://dukesadmin:duke511@ds051665.mlab.com:51665/dukesxi'

def getdbObject():
    client = MongoClient(mongodb)
    db = client.dukesxi
    return db

def saveUser(userObj):
    db = getdbObject()
    if userObj["tca_associated"] == "-1" :
        name=userObj["name"]
        send_mail("%s is requesting to join the Dukes XI Cricket Team" % (name),"cricketadmin@dukesxi.co",userObj.get("email"),"Permission to join Dukes XI Cricket Team")
    user_id = db.user.insert_one(userObj)
    return user_id

def getUser(userName):
    db = getdbObject()
    user = db.user.find_one({"username":userName})
    user['_id'] = str(user['_id'])
    return user

def getUsers():
    db = getdbObject()
    users = list(db.user.find())
    users = [fixId(u) for u in users]

    return users

def fixId(user):
    user['_id'] = str(user['_id'])
    return user

def getUserUsingTCAID(tca_id):
    db = getdbObject()
    result = db.user.find_one({"tca_id":tca_id})
    print result
    return result

def updateUser(userName,userObj,associate):
    db = getdbObject()
    updateResult = db.user.replace_one({"username":userName},userObj,upsert=False)

    if associate == "1"  and updateResult.modified_count>0:
        name=userObj.get("name")
        tca_id=userObj.get("tca_id")
        send_mail("%s is requesting to associate TCA ID %s with his user id %s" % (name,tca_id,userName),"cricketadmin@dukesxi.co",userObj.get("email"),"Permission to assoicate TCA ID with user id")

    return updateResult.modified_count


def queryUser(key,value):
    client = MongoClient(mongodb)
    db = client.dukesxi
    users = list(db.user.find({key:value}))
    return users
                  
def getUserSkill(user):
    db = getdbObject()
    user = db.user.find_one({"username":user})
    if user is not None:
        return user["tca_skillset"]

    return None

def send_mail(message,to,cc,subject):
    print "Sending mail to %s" % to
    requests.post("https://api.mailgun.net/v2/dukesxi.co/messages",auth=("api","key-6juj8th780z4bbbf1jpl7ffpx5z34wa9"),data={"from":"Dukes XI <cricketteam@dukesxi.co>","to":to,"cc":cc,"subject":subject,"text":message})

def getUserHelper(key,value):
    client = MongoClient(mongodb)
    db = client.dukesxi
    userCursor = db.user.find({key:value})
    users = []
    for user in userCursor:
        users.append(user)
    return users
