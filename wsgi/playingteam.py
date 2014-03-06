__author__ = 'apatti'

import json,httplib,urllib
import urllib2
import requests
import dukesMail as mail

connection = httplib.HTTPSConnection('api.parse.com',443)

def getPlayingTeamMessage(playingTeamObj):
        message=""
        message=message+"<b>Please find the playing XI:</b><br>\n<ol>"
        for user in playingTeamObj.get("team"):
            message=message+"<li>"+user+"</li>\n"

        message=message+"</ol>Ground:\n%s\n\t\t" % playingTeamObj.get("ground")
        message = message+"<br>Time:%s\n" % playingTeamObj.get("time")
        message = message+"\n%s\n" % playingTeamObj.get("message")
        message = message+"\n--\nDukes XI Management"

        return message

def createPlayingTeam(playingTeamObj):

    connection.connect()
    connection.request('POST', '/1/classes/playingteam',json.dumps(playingTeamObj), {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())

    message = getPlayingTeamMessage(playingTeamObj)
    print message
    mail.send_mail_to(message, "ashwin.patti@gmail.com", "ashwin.patti@gmail.com", "Playing XI")

    return "ok"


def getPlayingTeam():
    params = urllib.urlencode(
        {"order": "-updatedAt", "limit": 1
        })
    connection.connect()
    connection.request('GET', '/1/classes/playingteam','', {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    return result