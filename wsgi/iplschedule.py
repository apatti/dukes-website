__author__ = 'apatti'
import json,httplib,urllib



def getIplSchedule():
    params = urllib.urlencode({"order":"matchid"});
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('GET','/1/classes/iplschedule?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    #result = json.loads(connection.getresponse().read())
    return json.loads(connection.getresponse().read())

def getIplFantasySchedule():
    params = urllib.urlencode({"order":"fantasyweek"});
    connection = httplib.HTTPSConnection('api.parse.com',443)
    connection.connect()
    connection.request('POST','/1/functions/getIplFantasySchedule',json.dumps({}),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    return json.loads(connection.getresponse().read())

