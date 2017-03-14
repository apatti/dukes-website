import json,httplib,urllib
from dukesuser import getUserSkill,getUserHelper
import dukesMail as mail
from firebase import firebase
import dbutil
from bson.objectid import ObjectId

fb = firebase.FirebaseApplication('https://dukes-cricket.firebaseio.com',None)
 
def getPollMailMessage(question):
    message = '<div style="margin-bottom:3px;font-weight:bold;">Enter your vote today! A new poll has been created for the DukesXI group:</div><hr>'
    message += '<p><div style="margin-bottom:3px;">'+question+'</div></p>'
    message += '<div style="margin-bottom:5px;">To vote, please visit the following web page:http://www.dukesxi.co/poll.html </div><br/><br/><p><div style="margin-bottom:5px;">Thanks,<br/>DukesXI Management</div></p>'
    return message

def createFbPoll(pollObj):
    result = fb.put('/testpolls',pollObj["question"],pollObj,params={'print': 'pretty'})
    print result
    return result

def createPoll(pollObj,optObj,sendMailTo):
    db = dbutil.getdbObject()
    pollId = db.polls.insert_one(pollObj).inserted_id

    message = getPollMailMessage(pollObj["question"])
    message = mail.mailMessage(message,"Poll created - "+pollObj["question"],"Dukes Management")
    if sendMailTo == 0:
        mail.send_mail_cricket(message,"ashwin.patti@gmail.com","New poll for DukesXI Cricket Team")

    return str(pollId)

def getPoll(poll_id):
    db = dbutil.getdbObject()
    pollObj = db.polls.find_one({"_id":ObjectId(poll_id)})
    pollObj['_id'] = str(pollObj['_id'])
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
    db = dbutil.getdbObject()
    if prev_optid is not None and prev_optid != '':
        db.polls.update_one({"_id":ObjectId(poll_id)},{"$pull": {prev_optid:username}})

    updateResult = db.polls.update_one({"_id":ObjectId(poll_id)},{"$addToSet": {optid:username}})
    return updateResult.modified_count


def getPolls():
    db = dbutil.getdbObject()
    polls = list(db.polls.find())
    for poll in polls:
        poll["_id"] = str(poll["_id"])
    return list(polls)


def getOpenPolls():
    db = dbutil.getdbObject()
    pollCursor = db.polls.find({"isClosed":0})
    if pollCursor is None:
        return []
    else:
        polls = list(pollCursor)
        for poll in polls:
            poll["_id"] = str(poll["_id"])

        return polls

def closePoll(poll_id):
    db = dbutil.getdbObject()
    db.polls.update_one({"_id":ObjectId(poll_id)},{"$set":{"isClosed":1}})
    pollCursor = db.polls.find({"_id":ObjectId(poll_id)})
    options = []
    for option in pollCursor["options"]:
        options.append(option['text'])

    pollUsers = {}
    for option in options:
        pollUsers[option]=pollCursor[option]

    #admins = getUserHelper("isAdmin",True)
    #return [x["email"] for x in admins]
    sendPollCloseMail(pollUsers,pollCursor["question"])
    pass 

def sendPollCloseMail(pollUsers,title):
    admins = getUserHelper("isAdmin",True)
    adminEmails = ",".join([x["email"] for x in admins])
    messageBody =""
    for polloption in pollUsers:
        messageBody +='<div><div style="margin-bottom:3px;font-weight:bold">'+polloption+'</div><hr>'
        for user in pollUsers[polloption]:
            messageBody += '<div style="margin-bottom:5px">'+user+'</div>'
        messageBody += '</div><br/>'
    message = mail.mailMessage(messageBody,"Poll closed - "+title,"Dukesxi Web Service")
    mail.send_html_mail_to(message,adminEmails,"ashwin.patti@gmail.com","Poll closed - "+title)
