import json,httplib,urllib

connection = httplib.HTTPSConnection('api.parse.com',443)
def saveUser(userObj):
    connection.connect()
    connection.request('POST','/1/classes/user',json.dumps(userObj),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    return result

def getUser(userName):
    connection.connect()
    params = urllib.urlencode({"where":json.dumps({"username":userName})})
    connection.request('GET','/1/classes/user?%s' % params, '',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Cont\
ent-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    return result

def updateUser(userName,userObj):
    existingUser = getUser(userName)
    if not existingUser.get("results"):
        abort(404)
    print existingUser.get("results")[0].get("objectId")
    connection.connect()
    connection.request('PUT','/1/classes/user/%' % existingUser.get("results")[0].get("objectId"),json.dumps(userObj),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    return result
                      
