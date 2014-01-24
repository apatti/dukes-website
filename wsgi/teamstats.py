import json,requests

def getTeamWL():
    statsResponse = requests.get('http://tennisballcricket.org/cricket_module/mobile_service.php?action=getTeamStatDetails&tid=184')
    games = json.loads(statsResponse.content).get("Games")
    return calculateWLRatio(games)

def calculateWLRatio(games):
    w = 0.0
    l = 0.0
    t = 0.0
    gamesRatio = []
    for game in games:
        if game['winner']=="3" :
            continue
        t = t+1
        if (game['bat_team1_id']=="184" and game['winner']=="1") or (game['bat_team2_id']=="184" and game['winner']=="2"):
            w=w+1
        if (game['bat_team1_id']=="184" and game['winner']=="2") or (game['bat_team2_id']=="184" and game['winner']=="1"):
            l=l+1
        r = (w)/(w+l)
        game["ratio"]=r
        game["match_date"]=game["match_date"].split(' ')[0]
        gamesRatio.append(game)
        
    return gamesRatio
