import json,httplib,urllib
from dukesuser import getUserSkill,getUserHelper
import dukesMail as mail
from pymongo import MongoClient
import os

mongodb = os.environ['MONGODB_STRING']
 
def getPollMailMessage(question):
    message = '<div style="margin-bottom:3px;">Enter your vote today! A new poll has been created for the DukesXI group:</div>'
    message += '<div style="margin-bottom:3px;">'+question+'</div>'
    message += '<div style="margin-bottom:5px;">To vote, please visit the following web page:http://www.dukesxi.co/poll.html </div><div>Thanks, DukesXI Management</div>'
    return message


def createPoll(pollObj,optObj,sendMailTo):
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('POST','/1/classes/polls',json.dumps(pollObj),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    pollId = result.get("objectId")
    if not pollId:
        abort(400)
    #poll is created, populate the options table.
    for option in optObj:
        option["pollid"] = pollId
        connection.connect()
        connection.request('POST','/1/classes/polloptions',json.dumps(option),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
        connection.getresponse().read()
    
    message = getPollMailMessage(pollObj["question"])
    message = mail.mailMessage(message,"Poll created - "+pollObj["question"],"Dukes Management")
    if sendMailTo == 0:
        mail.send_mail_cricket(message,"ashwin.patti@gmail.com","New poll for DukesXI Cricket Team")

    return pollId

def getPoll(poll_id):
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/polls/%s'%poll_id,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Con\
tent-Type": "application/json"})
    pollObj = json.loads(connection.getresponse().read())
    
    params = urllib.urlencode({"where":json.dumps({"pollid":poll_id})})
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/polloptions?%s'%params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    options = json.loads(connection.getresponse().read())
    pollObj["options"]=options.get("results")

    return pollObj

def deletePoll(poll_id):
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('DELETE','/1/classes/polls/%s'%poll_id,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Con\
tent-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    
    params = urllib.urlencode({"where":json.dumps({"pollid":poll_id})})
    connection.connect()
    connection.request('GET','/1/classes/polloptions?%s'%params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    optionsObj=json.loads(connection.getresponse().read()).get("results")
    for optionObj in optionsObj:
        #print optionObj
        connection.connect()
        connection.request('DELETE','/1/classes/polloptions/%s'%optionObj.get("objectId"),'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
        connection.getresponse().read()
    
    return "deleted" 

def takePoll(poll_id,username,userid,optid,prev_optid):
    userskill = getUserSkill(userid)
    username= username + " (" + userskill + ")"
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    if not prev_optid or prev_optid != '':
        #handle the old option.
        #TODO: Should handle this properly later on.
        #print 'Removing '+username+' from '+prev_optid
        connection.request('PUT','/1/classes/polloptions/%s'%prev_optid,json.dumps({"users":{"__op":"Remove","objects":[username]}}),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
        connection.getresponse().read()
    
    connection.request('PUT','/1/classes/polloptions/%s'%optid,json.dumps({"users":{"__op":"AddUnique","objects":[username]}}),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"}) 
    result = json.loads(connection.getresponse().read())
    
    return result


def getPolls():
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/polls','',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    pollsObj = json.loads(connection.getresponse().read()).get("results");
    #print pollsObj
    for pollObj in pollsObj:
        connection.connect()
        params = urllib.urlencode({"where":json.dumps({"pollid":pollObj.get("objectId")})})
        connection.request('GET','/1/classes/polloptions?%s'%params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
        options = json.loads(connection.getresponse().read())
        pollObj["options"]=options.get("results")
    
    return pollsObj


def getOpenPolls():
    client = MongoClient(mongodb)
    db = client.dukesxi
    pollCursor = db.polls.find({"isClosed":0})
    openPoll= []
    for poll in pollCursor:
        openPoll.append(poll)
    
    return openPoll

def closePoll(poll_id):
    client = MongoClient(mongodb)
    db = client.dukesxi
    db.polls.update_one({"_id":poll_id},{"$set":{"isClosed":1}})
    pollCursor = db.polloptions.find({"pollid":poll_id},["users","text"])
    pollUsers = {}
    for users in pollCursor:
        pollUsers[users["text"]]=users["users"]
    
    polldocument = db.polls.find_one({"_id":poll_id},["question"])
    admins = getUserHelper("isAdmin",True)
    #return [x["email"] for x in admins]
    sendPollCloseMail(pollUsers,polldocument["question"])
    pass 

def sendPollCloseMail(pollUsers,title):
    admins = getUserHelper("isAdmin",True)
    adminEmails = ",".join([x["email"] for x in admins])
    messageBody =""
    print pollUsers
    for polloption in pollUsers:
        messageBody +='<div><div style="margin-bottom:3px;font-weight:bold">'+polloption+'</div>'
        for user in pollUsers[polloption]:
            print user
            messageBody += '<div style="margin-bottom:5px">'+user+'</div>'
        messageBody += '</div>'
    message = mail.mailMessage(messageBody,"Poll closed - "+title,"Dukesxi Web Service")
    print message
    #mail.send_html_mail_to(message,adminEmails,"ashwin.patti@gmail.com","Poll closed - "+title)
