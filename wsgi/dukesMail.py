import json,httplib,urllib
import urllib2
import requests

connection = httplib.HTTPSConnection('api.parse.com',443)

def send_mail_to(message,to,cc,subject):
    print "Sending mail to %s" % to
    requests.post("https://api.mailgun.net/v2/dukesxi.co/messages",auth=("api","key-6juj8th780z4bbbf1jpl7ffpx5z34wa9"),data={"from":"Dukes XI <cricketteam@dukesxi.co>","to":to,"cc":cc,"subject":subject,"text":message})

def send_mail_all(message,cc,subject):
    params = urllib.urlencode({"where":json.dumps({"tca_associated": 1}), "keys": "email"})
    connection.connect()
    connection.request('GET','/1/classes/user?%s' % params,'',{"X-Parse-Application-Id": "ioGYGcXuXi2DRyPYnTLB6lTC5DSPtiLbOhAU9P1M","X-Parse-REST-API-Key": "3yuAKMX4bz8QouVmfWBODyleTV5GzD3yhn2yYzYo","Content-Type": "application/json"})
    result = json.loads(connection.getresponse().read())
    emailList =",".join([res['email'] for res in result.get("results")])
    requests.post("https://api.mailgun.net/v2/dukesxi.co/messages",auth=("api","key-6juj8th780z4bbbf1jpl7ffpx5z34wa9"),data={"from":"Dukes XI <cricketteam@dukesxi.co>", "to":emailList,"cc":cc,"subject":subject,"text":message})
    
def send_mail_cricket(message,cc,subject):
    send_mail_to(message,"cricketteam@dukesxi.co",cc,subject)

