from flask import Flask,jsonify,make_response,request,abort
import json,httplib,urllib,os
from dukesuser import getUser,saveUser,updateUser,getUserUsingTCAID,getUsers
from teamstats import getTeamWL
from polls import createPoll,getPoll,takePoll,getPolls,deletePoll
from superbowl import getSuperBowl,insertSuperBowl

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
    userObj["tca_associated"]=0
    result = getUser(userObj["username"])
    if not result.get("results"):
        result = saveUser(userObj)
        return jsonify({'result':userObj}),201

    return jsonify({'result':result}),200

@app.route('/users/',methods=['GET'])
def getUsersApi():
    result = getUsers()
    return jsonify({'users':result}),200

@app.route('/users/<username>',methods=['GET'])
def getUserApi(username):
    result = getUser(username)    
    if not result.get('results'):
        abort(404) #TODO: Add custom exceptions and error handlers
    else:
        return jsonify({'user':result}),200

@app.route('/users/tca/<tca_id>',methods=['GET'])
def getUserTcaId(tca_id):
    result = getUserUsingTCAID(tca_id)
    if not result.get('results'):
        abort(404)
    else:
        return jsonify({'user':result}),200


@app.route('/users/<username>',methods=['PUT'])
def updateUserApi(username):
    reqObj = request.get_json(force=True)
    associate = request.args.get('associate')
    result = updateUser(username,reqObj,associate)
    
    return jsonify({'user':result}),201

@app.route('/team/stats',methods=['GET'])
def getTeamStats():
    return jsonify(getTeamWL()),200


@app.route('/polls',methods=['POST'])
def createPollApi():
    if not request.get_json:
        abort(400)

    reqObj = request.get_json(force=True)
    pollObj ={}
    pollObj["username"]=reqObj.get("username")
    pollObj["question"] = reqObj.get("question")
    pollObj["closeMethod"] = reqObj.get("closeMethod")
    pollObj["endDate"] = reqObj.get("endDate")
    #pollObj["options"]=reqObj.get("options")
    pollObj["isClosed"]=0
    print pollObj
    print reqObj.get("options")
    result = createPoll(pollObj,reqObj.get("options"))
    return jsonify({'id':result}),201

@app.route('/polls/<poll_id>',methods=['GET'])
def getPollApi(poll_id):
    return jsonify(getPoll(poll_id)),200

@app.route('/polls/<poll_id>',methods=['DELETE'])
def deletePollApi(poll_id):
    return jsonify(deletePoll(poll_id)),200

@app.route('/polls',methods=['GET'])
def getAllPolls():
    return json.dumps(getPolls()),200

@app.route('/polls/<poll_id>',methods=['PUT'])
def takePollApi(poll_id):
    if not request.get_json:
        abort(400)

    result = getPoll(poll_id)
    if result.get('code'):
        abort(404)
    reqObj = request.get_json(force=True)
    result = takePoll(poll_id,reqObj.get("username"),reqObj.get("current_option_id"),reqObj.get("prev_option_id"))
    return jsonify({'result':result}),201

@app.route('/superbowl',methods=['POST'])
def insertSuperBowlApi():
    reqObj=request.get_json(force=True)
    result = insertSuperBowl(reqObj)
    
    return jsonify({'result':result}),201

@app.route('/superbowl',methods=['GET'])
def getSuperBowlApi():
    return jsonify(getSuperBowl()),200

@app.route('/gallery/',methods=['GET'])
def getGalleryApi():
    path = app.root_path+'/static/images/gallery'
    listing = os.listdir(path)
    lst = []
    for pn in listing:
        d = {}
        d['img']=pn
        lst.append(d)
    return json.dumps(lst),200
	
@app.errorhandler(404) #TODO: Add custom exceptions and error handlers
def no_data(error):
    return make_response(jsonify({'error':'Not Found'}),404)

@app.errorhandler(400)
def invalid_data_format(error):
    return make_response(jsonify({'error':'Data is not in json format'}),400)

if __name__ == '__main__':
    app.run(debug=True)
