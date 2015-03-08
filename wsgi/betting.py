import json,httplib,urllib


def getBet(bet_id):
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/bets/%s'%bet_id,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Con\
tent-Type": "application/json"})
    betObj = json.loads(connection.getresponse().read())
    
    return betObj

def placeBet(bet_id,username,betNumber):
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    userBet = username+":"+betNumber
    connection.request('PUT','/1/classes/bets/%s'%bet_id,json.dumps({"users":{"__op":"AddUnique","objects":[userBet]}}),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"}) 
    result = json.loads(connection.getresponse().read())
    
    return result

def getBets():
    print "TESTTT"
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/bets','',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    betsObj = json.loads(connection.getresponse().read()).get("results")
    return betsObj
