import json,httplib,urllib
from dukesuser import getUserSkill
import dukesMail as mail


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


