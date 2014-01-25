import json,requests

def getTeamWL():
    statsResponse = requests.get('http://tennisballcricket.org/cricket_module/mobile_service.php?action=getTeamStatDetails&tid=184')
    stats = json.loads(statsResponse.content)
    (games,captainwins,captainties,captainlosses) = calculateWLRatio(stats.get("Games"))
    stats["Games"]=games
    stats["CaptainWins"]=captainwins
    stats["CaptainTies"]=captainties
    stats["CaptainLosses"]=captainlosses
    return stats

def calculateWLRatio(games):
    w = 0.0
    l = 0.0
    t = 0.0
    gamesRatio = []
    captains=[]
    captainwins = {}
    captainties ={}
    captainlosses={}
    for game in games:
        if game['winner']=="3" :
            captainties[game['captain']]=captainties.get(game['captain'],0)+1
            continue
        t = t+1
        if (game['bat_team1_id']=="184" and game['winner']=="1") or (game['bat_team2_id']=="184" and game['winner']=="2"):
            w=w+1
            captainwins[game['captain']]=captainwins.get(game['captain'],0)+1
        if (game['bat_team1_id']=="184" and game['winner']=="2") or (game['bat_team2_id']=="184" and game['winner']=="1"):
            l=l+1
            captainlosses[game['captain']]=captainlosses.get(game['captain'],0)+1
        r = (w)/(w+l)
        game["ratio"]=r
        game["win"]=w
        game["loss"]=l
        game["tie"]=t
        game["match_date"]=game["match_date"].split(' ')[0]
        gamesRatio.append(game)
    
        
    print captainwins,captainties,captainlosses
    #gamesRatio['Captains']= captains
    return gamesRatio,captainwins,captainties,captainlosses
