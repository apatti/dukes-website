__author__ = 'apatti'

import json,httplib,urllib
import urllib2
import requests
import dukesMail as mail

def getPlayingTeamMessage(playingTeamObj):
        message=""
        message=message+"Please find the playing XI:\n"
        index = 1
        for user in playingTeamObj.get("team"):
            message = message+"\t"+str(index)+"."+user+"\n"
            index=index+1

        message=message+"\nVenue:\n\t\t%s\n" % playingTeamObj.get("ground")
        message = message+"Time:\t\t%s\n" % playingTeamObj.get("time")
        message = message+"\n%s\n" % playingTeamObj.get("message")
        message = message+"\n--\nDukes XI Management"

        return message

def createPlayingTeam(playingTeamObj):
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('POST', '/1/classes/playingteam',json.dumps(playingTeamObj), {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())

    message = getPlayingTeamMessage(playingTeamObj)
    print message
    mail.send_mail_cricket(message, "ashwin.patti@gmail.com", "Playing XI")

    return "ok"


def getPlayingTeam():
    params = urllib.urlencode(
        {"where":json.dumps({"objectId": "zR1SI0BrKv"}),"order": "-updatedAt", "limit": 1
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