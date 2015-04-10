__author__='apatti'
import json,httplib,urllib
import urllib2
import requests
import re
import math


class ScoreCard:
    baseUrl_first="https://api.import.io/store/data/"
    battingDataId="df374428-914c-4d03-8e83-3b56a71a7850"
    bowlingDataId="5030fdf7-da53-488c-82a3-eabc9e2543ce"
    dnbDataId="3b270120-41b3-4530-a8c9-a5bbb6e33718"
    baseUrl_second="/_query?input/webpage/url=http%3A%2F%2Fwww.espncricinfo.com%2Ficc-cricket-world-cup-2015%2Fengine%2Fmatch%2F"
    baseUrl_third=".html%3Fview%3Dscorecard&_user=1b91257b-7963-462c-b204-58d9ef26c45e&_apikey="
    apikey="BB5%2By6wOGnrm3RPDelGTGaMC8Cs6HF1CI7sJuXIIxP6Etsz0mHw69jMcAqeqPlhClkjWSQa3BerY3uG6ZQEM1A%3D%3D"

    def __init__(self,matchId):
        self.matchId=str(matchId)
        #self.matchUrl=ScoreCard.baseUrl_first+self.matchId+ScoreCard.baseUrl_second+ScoreCard.apikey
    
    def __parseScoreCardBowling(self):
        url = '/store/data/'+ScoreCard.bowlingDataId+ScoreCard.baseUrl_second+self.matchId+ScoreCard.baseUrl_third+ScoreCard.apikey
        connection = httplib.HTTPSConnection('api.import.io',443)
        connection.connect()
        connection.request('GET',url)
        result =json.loads(connection.getresponse().read())
        bowlingCard = result['results']
        bowlingCard =[{'name':bowler.get('name/_text'),'overs':bowler.get('overs'),'balls':math.floor(bowler["overs"])*6+int((bowler["overs"]-math.floor(bowler["overs"]))*10),'wickets':bowler.get('wickets'),'maidens':bowler.get('maidens'),'eco':bowler.get('eco'),'bowling_runs':bowler.get('runs')} for bowler in bowlingCard]
        return bowlingCard

    def __parseScoreCardBatting(self):
        url = '/store/data/'+ScoreCard.battingDataId+ScoreCard.baseUrl_second+self.matchId+ScoreCard.baseUrl_third+ScoreCard.apikey
        connection = httplib.HTTPSConnection('api.import.io',443)
        connection.connect()
        connection.request('GET',url)
        result =json.loads(connection.getresponse().read())
        battingCard = result['results']
        #if 'srr' in battingCard[0]:
        batsmanList = [{'name':batsman.get('name/_text'),'balls':int(batsman.get('balls')),'sixes':int(batsman.get('sixes')),'fours':int(batsman.get('fours')),'runs':int(batsman.get('runs')),'srr':batsman.get('srr')} for batsman in battingCard if 'runs' in batsman and 'srr' in batsman]
        batsmanList.extend([{'name':batsman.get('name/_text'),'balls':int(batsman.get('minutes')),'sixes':int(batsman.get('fours')),'fours':int(batsman.get('balls')),'runs':int(batsman.get('runs')),'srr':batsman.get('sixes')} for batsman in battingCard if 'runs' in batsman and 'srr' not in batsman])
        #print batsmanList
        dnbBatsman = [batsman.get('dnb/_text') for batsman in battingCard if 'dnb' in batsman]
        print dnbBatsman
        if len(dnbBatsman)>1:
            dnbBatsman = dnbBatsman[0].extend(dnbBatsman[1])
        else:
            dnbBatsman = dnbBatsman[0]
        batsmanList.extend([{'name':batsman,'balls':0,'sixes':0,'fours':0,'runs':0,'srr':'0.0'} for batsman in dnbBatsman])
        fieldingCard = [batsman.get('howout') for batsman in battingCard if 'runs' in batsman and not (batsman.get('howout').startswith('b') or batsman.get('howout').startswith('n') or batsman.get('howout').startswith('lbw'))]
        #assuming catches, runout and stumps are equal.
        runOuts = [fielder[fielder.find('(')+1:fielder.find(')')] for fielder in fieldingCard if ' b ' not in fielder]
        runOutsFielders = []
        #directRunOutsFielders = []
        for fielder in runOuts:
            #if '/' in fielder:
            runOutsFielders.extend(fielder.split('/'))
            #else:
            #    directRunOutsFielders.extend(fielder)
        fieldingCard = [fielder[fielder.find(' ')+1:fielder.find(' b')] for fielder in fieldingCard if ' b' in fielder]
        fieldingCard.extend(runOutsFielders)
        return batsmanList,fieldingCard

    def parseScoreCard(self):
        batsmanList,fieldingList = self.__parseScoreCardBatting()
        bowlersList = self.__parseScoreCardBowling()
        playerList=[]
        for batsman in batsmanList:
            battingpoints = 0
            player={}
            battingpoints += batsman["runs"]
            battingpoints += batsman["sixes"]*2

            if batsman["runs"] >= 25 and batsman["runs"] < 50:
                battingpoints += 25
            if batsman["runs"] >= 50 and batsman["runs"] < 75:
                battingpoints += 50
            if batsman["runs"] >= 75 and batsman["runs"] < 100:
                battingpoints += 75
            if batsman["runs"] >= 100:
                battingpoints += 100

            if batsman["runs"]>batsman["balls"] :
                battingpoints += (batsman["runs"]-batsman["balls"])

            batsman['runPoints']=battingpoints
            batsman['runBonus']=0
            playerList.append({'name':batsman['name'],'batstats':batsman,'fieldPoints':0})
        
        for bowler in bowlersList:
            bowlingpoints = 0
            bowlingpoints += bowler["wickets"]*20
            bowlingpoints += bowler["maidens"]*20
            balls = math.floor(bowler["overs"])*6+int((bowler["overs"]-math.floor(bowler["overs"]))*10)
            if balls > bowler["bowling_runs"]:
                bowlingpoints += ((balls-bowler["bowling_runs"])*4)
            if bowler["wickets"] >= 2:
                bowlingpoints += bowler["wickets"]*10

            name = bowler['name']
            bowler['wicketPoints']=bowlingpoints
            bowler['maidenPoints']=0
            bowler['wicketBonus']=0
            player = [player for player in playerList if player['name']==name][0]
            player['bowlstats']=bowler.copy()
            
        for fielder in fieldingList:
            player = [player for player in playerList if fielder[1:] in player['name']][0]
            #print player
            if 'fieldPoints' in player:
                player['fieldPoints']+=10
            else:
                player['fieldPoints']=10
            #fieldingpoints += fantasyScore["fieldingCatches"]*10
            #fieldingpoints += fantasyScore["fieldingStumping"]*15
            #fieldingpoints += fantasyScore["directRunOut"]*15
            #fieldingpoints += fantasyScore["fieldingRunOut"]*10
        

        for player in playerList:
            totalPoints = player['batstats']['runPoints']+player['batstats']['runBonus']
            if 'fieldPoints' in player:
                totalPoints += player['fieldPoints']

            if 'bowlstats' in player:
                bowlingPoints = player['bowlstats']['wicketPoints']+player['bowlstats']['maidenPoints']+player['bowlstats']['wicketBonus']
                totalPoints += bowlingPoints

            player['totalPoints']=totalPoints
            
        return playerList


def getScoreCard(matchId):
    scorecard=ScoreCard(matchId)
    playerDetails = scorecard.parseScoreCard()
    playerDetails = sorted(playerDetails,key=lambda x: x['totalPoints'],reverse=True)
    return playerDetails
    #for player in playerDetails:
    #    print player['name'],player['totalPoints']
