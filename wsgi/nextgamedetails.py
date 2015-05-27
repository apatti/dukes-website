__author__ = 'apatti'

import json,httplib,urllib
import urllib2
import requests

class NextGame:

    __nextgameUrl = "http://tennisballcricket.com/briefSchedule"
    __teamId = "184"

    def __init__(self):
        self.playingGame=[]
        self.umpiringGame=[]
        gamesData = json.loads(requests.get(NextGame.__nextgameUrl).text)
        for group in gamesData['Matches']:
            self.playingGame.extend([match for match in group if match['Team1']['TeamId']==NextGame.__teamId or match['Team2']['TeamId']==NextGame.__teamId])
            self.umpiringGame.extend([match for match in group if match['UmpTeam1']['TeamId']==NextGame.__teamId or match['UmpTeam2']['TeamId']==NextGame.__teamId])