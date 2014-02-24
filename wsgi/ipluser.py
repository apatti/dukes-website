import json,httplib,urllib
import urllib2
import requests
from dukesuser import *

connection = httplib.HTTPSConnection('api.parse.com',443)
def saveIPLUser(userName,userTeam,userEmail):
    userObj = {}
    userObj["iplteam"]=userTeam
    userObj["email"]=userEmail
    return updateUser(userName,userObj,0)
