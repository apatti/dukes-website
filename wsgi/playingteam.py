__author__ = 'apatti'

import json,httplib,urllib
import urllib2
import requests
import dukesMail as mail

connection = httplib.HTTPSConnection('api.parse.com',443)


def createPlayingTeam(playingTeamObj):
    params = urllib.urlencode({"where": json.dumps({
        "username": {
            "$in": playingTeamObj.get("team")
        }
    }), "keys": "username,name,tca_skillset"})

    connection.connect()
    connection.request('GET','/1/classes/users?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    users = json.loads(connection.getresponse().read()).get("results")
    print users
    playingTeamObj["team"] = []
    for user in users:
        playingTeamObj["team"].append(user.get("username")+'-'+user.get("tca_skillset"))

    print playingTeamObj

    connection.request('POST', '/1/classes/playingteam',json.dumps(playingTeamObj), {"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())

    #message = getPollMailMessage(pollObj["question"])
    #if sendMailTo==0 : #cricket team
    #    mail.send_mail_cricket(message,"ashwin.patti@gmail.com","New poll for DukesXI Cricket Team")

    return "ok"