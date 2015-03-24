__author__='apatti'
import json,httplib,urllib
import urllib2
import requests
import re


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
        bowlingCard =[{'name':bowler.get('name/_text'),'overs':bowler.get('overs'),'wickets':bowler.get('wickets'),'maidens':bowler.get('maidens'),'eco':bowler.get('eco'),'bowling_runs':bowler.get('runs')} for bowler in bowlingCard]
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
        if len(dnbBatsman)>1:
            dnbBatsman = dnbBatsman[0]+dnbBatsman[1]
        else:
            dnbBatsman = dnbBatsman[0]
        batsmanList.extend([{'name':batsman,'balls':0,'sixes':0,'fours':0,'runs':0,'srr':'0.0'} for batsman in dnbBatsman])
        fieldingCard = [batsman.get('howout') for batsman in battingCard if 'runs' in batsman and not (batsman.get('howout').startswith('b') or batsman.get('howout').startswith('n') or batsman.get('howout').startswith('lbw'))]
        #assuming catches, runout and stumps are equal.
        runOuts = [fielder[fielder.find('(')+1:fielder.find(')')] for fielder in fieldingCard if ' b ' not in fielder]
        runOutsFielders = []
        for fielder in runOuts:
            runOutsFielders.extend(fielder.split('/'))
        fieldingCard = [fielder[fielder.find(' ')+1:fielder.find(' b')] for fielder in fieldingCard if ' b' in fielder]
        fieldingCard.extend(runOutsFielders)
        return batsmanList,fieldingCard

    def parseScoreCard(self):
        batsmanList,fieldingList = self.__parseScoreCardBatting()
        bowlersList = self.__parseScoreCardBowling()
        playerList=[]
        for batsman in batsmanList:
            player={}
            runs = batsman['runs']
            runPoints = runs/20
            runBonus=0
            if runs>50:
                runBonus+=1
            if runs>100:
                runBonus+=1
            if runs>150:
                runBonus+=1
            #player=batsman
            batsman['runPoints']=runPoints
            batsman['runBonus']=runBonus
            playerList.append({'name':batsman['name'],'batstats':batsman,'fieldPoints':0})
        
        for bowler in bowlersList:
            wickets = bowler['wickets']
            maidens= bowler['maidens']
            wicketBonus =0
            if wickets>=3 and wickets <5:
                wicketBonus+=1
            if wickets>=5 and wickets <7:
                wicketBonus+=2
            if wickets>=7:
                wicketBonus+=3
            name = bowler['name']
            bowler['wicketPoints']=wickets
            bowler['maidenPoints']=maidens
            bowler['wicketBonus']=wicketBonus
            player = [player for player in playerList if player['name']==name][0]
            player['bowlstats']=bowler.copy()
            
        for fielder in fieldingList:
            player = [player for player in playerList if fielder[1:] in player['name']][0]
            #print player
            if 'fieldPoints' in player:
                player['fieldPoints']+=1
            else:
                player['fieldPoints']=1

        

        for player in playerList:
            totalPoints = player['batstats']['runPoints']+player['batstats']['runBonus']
            if 'fieldPoints' in player:
                totalPoints += player['fieldPoints']

            if 'bowlstats' in player:
                bowlingPoints = player['bowlstats']['wicketPoints']+player['bowlstats']['maidenPoints']+player['bowlstats']['wicketBonus']
                totalPoints += bowlingPoints
                if bowlingPoints*player['batstats']['runPoints']>0:
                    totalPoints += totalPoints

            player['totalPoints']=totalPoints
            
        return playerList


def getScoreCard(matchId):
    scorecard=ScoreCard(matchId)
    playerDetails = scorecard.parseScoreCard()
    playerDetails = sorted(playerDetails,key=lambda x: x['totalPoints'],reverse=True)
    return playerDetails
    #for player in playerDetails:
    #    print player['name'],player['totalPoints']
