from flask import Flask,jsonify,make_response,request,abort
import json,httplib

app = Flask(__name__,static_url_path='')
connection = httplib.HTTPSConnection('api.parse.com',443)
connection.connect()

@app.route('/')
def index():
    return app.send_static_file('home.html')

@app.route('/users/', methods=['POST'])
def insertUser():
    if not request.get_json:
        abort(400)
    print("Good")
    reqObj = request.get_json(force=True)
    userObj ={}
    userObj["username"]=reqObj.get("username")
    userObj["id"] = reqObj.get("id")
    userObj["link"] = reqObj.get("link")
    userObj["name"] = reqObj.get("name")
    userObj["first_name"]=reqObj.get("first_name")
    userObj["last_name"] = reqObj.get("last_name")

    print(json.dumps(userObj))
    connection.request('POST','/1/classes/user',json.dumps(userObj),{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    #result = json.loads(connection.getresponse().read())
    return jsonify({'result':'result'}),200

@app.errorhandler(400)
def invalid_data_format(error):
    return make_response(json({'error':'Data is not in json format'}))

if __name__ == '__main__':
    app.run(debug=True)
