from flask import Flask,jsonify,make_response,request,abort
import json,httplib,urllib
from dukesuser import getUser,saveUser

app = Flask(__name__,static_url_path='')
app.config['PROPAGATE_EXCEPTIONS']=True
connection = httplib.HTTPSConnection('api.parse.com',443)
#connection.connect()

@app.route('/')
def index():
    return app.send_static_file('home.html')

@app.route('/users/', methods=['POST'])
def insertUserApi():
    if not request.get_json:
        abort(400)
    
    reqObj = request.get_json(force=True)
    userObj ={}
    userObj["username"]=reqObj.get("username")
    userObj["fb_id"] = reqObj.get("id")
    userObj["link"] = reqObj.get("link")
    userObj["name"] = reqObj.get("name")
    userObj["first_name"]=reqObj.get("first_name")
    userObj["last_name"] = reqObj.get("last_name")

    result = getUser(userObj["username"])
    if not result.get("results"):
        result = dukesuser.saveUser(userObj)
        
    return jsonify({'result':result}),201

@app.route('/users/<username>',methods=['GET'])
def getUserApi(username):
    result = getUser(username)    
    if not result.get('results'):
        abort(404) #TODO: Add custom exceptions and error handlers
    else:
        return jsonify({'user':result}),200


@app.errorhandler(404) #TODO: Add custom exceptions and error handlers
def no_data(error):
    return make_response(jsonify({'error':'User Not Found'}),404)

@app.errorhandler(400)
def invalid_data_format(error):
    return make_response(jsonify({'error':'Data is not in json format'}),400)

if __name__ == '__main__':
    app.run(debug=True)

def getUserDb(userName):
    connection.connect()
    params = urllib.urlencode({"where":json.dumps({"username":userName})})
    connection.request('GET','/1/classes/user?%s' % params, '',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    return json.loads(connection.getresponse().read())
