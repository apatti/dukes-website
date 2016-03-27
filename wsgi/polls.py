import json,httplib,urllib
from dukesuser import getUserSkill,getUserHelper
import dukesMail as mail
from pymongo import MongoClient
import os

mongodb = os.environ['MONGODB_STRING']
 
def getPollMailMessage(question):
    message = "Enter your vote today! A new poll has been created for the DukesXI group:"
    message = message + "\n%s"%question
    message = message + "\n\nTo vote, please visit the following web page:\nhttp://www.dukesxi.co/poll.html  \n\nThanks, DukesXI Management"
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
        print 'Removing '+username+' from '+prev_optid
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
    print pollsObj
    for pollObj in pollsObj:
        connection.connect()
        params = urllib.urlencode({"where":json.dumps({"pollid":pollObj.get("objectId")})})
        connection.request('GET','/1/classes/polloptions?%s'%params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
        options = json.loads(connection.getresponse().read())
        pollObj["options"]=options.get("results")
    
    return pollsObj


def closePoll(poll_id):
    client = MongoClient(mongodb)
    db = client.dukesxi
    db.polls.update_one({"_id":poll_id},{"$set":{"isClosed":1}})
    pollCursor = db.polloptions.find({"pollid":poll_id},["users","text"])
    pollUsers = {}
    for users in pollCursor:
        pollUsers[users["text"]]=users["users"]
    
    polldocument = db.polls.find_one({"_id":poll_id},["question"])
    #admins = getUserHelper("isAdmin",True)
    sendPollCloseMail(pollUsers,polldocument["question"])
    pass 

def sendPollCloseMail(pollUsers,title):
    admins = getUserHelper("isAdmin",True)
    #messageBody ='<div><div style="margin-bottom:3px;font-weight:bold">Available:</div>'
    for polloption in pollUsers:
        messageBody ='<div><div style="margin-bottom:3px;font-weight:bold">'+polloption+'</div>'
        for user in pollUsers[polloption]:
            messageBody += '<div style="margin-bottom:5px>'+user+'</div>'
    #messageBody +='<div style="margin-bottom:3px;font-weight:bold">Not Available:</div>'
    #for user in pollUsers['Not Available']:
    #    messageBody += '<div style="margin-bottom:5px>'+user+'</div>'
    messageBody += '</div>'

    message ='<html><body style="margin:0"><div style="text-align: center;background-color: #eee;width:100%;margin:0;padding:30px 0;font-family:Helvetica Neue Light, Lucida Grande, Helvetica, Arial;font-size: 12px;"><div style="width:96%;max-width:660px;margin:0 auto;"><table style="color:#000;background-color: #eee;margin: 10px auto; border: none;border-collapse: collapse;width: 100%;"><tbody><tr><td style="width:15%;text-align: left;"><img style="width: 80px;height: 80px;" src="http://www.dukesxi.co/images/Dukes+logo+red.jpg"></td><td style="width:85%;text-align: left;"><h1 style="font-size: 22px;padding-bottom: 5px;font-weight: bold;margin:0;">Poll'+title+' closed</h1><div style="color: #689;">Message initiated by <span style="font-weight: bold;"> Dukes XI Web Service</div></td></tr></tbody></table><table style="color:#000;background-color:#fff;margin:10px auto;border:none;border-collapse:collapse;width:100%;"><tbody><tr><td style="text-align: left;font-size: 14px;padding: 30px;height: 400px;vertical-align: top;">'
    message += messageBody;
    message +='</td></tr></tbody></table></div></div></body></html>'
    mail.send_html_mail_to(message,"ashwin.patti@gmail.com","ashwin.patti@gmail.com","Poll "+title+" closed")
