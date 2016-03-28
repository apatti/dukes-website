__author__ = 'apatti'

import json,httplib,urllib
import urllib2
import requests
import dukesMail as mail

def getPlayingTeamMessage(playingTeamObj):
        message='<div style="margin-bottom:3px;font-weight:bold;">Please find the playing XI:</div><hr><p><div><ol>'
        for user in playingTeamObj.get("team"):
            message += '<li>'+user+'</li>'
	ground = playingTeamObj.get("ground").replace('\n','<br />')    
	teamMessage = playingTeamObj.get("message").replace('\n','<br />')
        message += '</ol></p></div><div><div style="margin-bottom:3px;font-weight:bold;">Venue:</div>'+ground
        message += '<div style="margin-bottom:3px;font-weight:bold;">Date:</div> ' + playingTeamObj.get("gamedate")
        message += '<div style="margin-bottom:3px;font-weight:bold;">Time:</div> ' + playingTeamObj.get("time")
        message += '<div style="margin-bottom:3px;"> '+ teamMessage
        message += '</div><p><br/><br/>--<br/>Dukes XI Management</p>'
	
        return message

def createPlayingTeam(playingTeamObj):
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('POST', '/1/classes/playingteam',json.dumps(playingTeamObj), {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())

    message = getPlayingTeamMessage(playingTeamObj)
    message = mail.mailMessage(message,"Playing XI for next game","Dukes Management")
    print message
    #mail.send_mail_cricket(message, "ashwin.patti@gmail.com", "Playing XI")

    return "ok"


def getPlayingTeam():
    params = urllib.urlencode(
        {"order": "-updatedAt", "limit": 1
        })
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET', '/1/classes/playingteam?%s' % params, '', {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    return result

def getGamesMeta():
    params = urllib.urlencode(
        {"order": "-updatedAt", "keys": "gamedate,opposition,pollid"})
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET', '/1/classes/playingteam?%s' % params, '', {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    return result
