import json,httplib,urllib
import urllib2
import requests
import dbutil

def send_mail_to(message,to,cc,subject):
    print "Sending mail to %s" % to
    requests.post("https://api.mailgun.net/v2/dukesxi.co/messages",auth=("api","key-6juj8th780z4bbbf1jpl7ffpx5z34wa9"),data={"from":"Dukes XI <cricketteam@dukesxi.co>","to":to,"cc":cc,"subject":subject,"text":message})

def send_html_mail_to(message,to,cc,subject):
    print "Sending mail to %s" % to
    #print message
    requests.post("https://api.mailgun.net/v2/dukesxi.co/messages",auth=("api","key-6juj8th780z4bbbf1jpl7ffpx5z34wa9"),data={"from":"Dukes XI <cricketteam@dukesxi.co>","to":to,"cc":cc,"subject":subject,"html":message})

def send_mail_all(message,cc,subject):
    db = dbutil.getdbObject()
    emailCursor = db.users.find({"tca_associated":1},["email"])

    emailList =",".join([res['email'] for res in emailCursor])
    requests.post("https://api.mailgun.net/v2/dukesxi.co/messages",auth=("api","key-6juj8th780z4bbbf1jpl7ffpx5z34wa9"),data={"from":"Dukes XI <cricketteam@dukesxi.co>", "to":emailList,"cc":cc,"subject":subject,"text":message})
    
def send_mail_cricket(message,cc,subject):
    print "Sending mail to cricket!"
    db = dbutil.getdbObject()
    emailCursor = db.users.find({"tca_associated":1},["email"])
    emailList =",".join([res['email'] for res in emailCursor])
    print "Sending it to:"+emailList
    requests.post("https://api.mailgun.net/v2/dukesxi.co/messages",auth=("api","key-6juj8th780z4bbbf1jpl7ffpx5z34wa9"),data={"from":"Dukes XI <cricketteam@dukesxi.co>", "to":emailList,"cc":cc,"subject":subject,"html":message})

def send_mail_ipl(message,cc,subject):
    db = dbutil.getdbObject()
    emailCursor = db.users.find({"iplAccess":1},["email"])

    emailList =",".join([res['email'] for res in emailCursor])

    emailList="ashwin.patti@gmail.com"
    print emailList
    requests.post("https://api.mailgun.net/v2/dukesxi.co/messages",auth=("api","key-6juj8th780z4bbbf1jpl7ffpx5z34wa9"),data={"from":"Dukes IPL Fantasy <cricketteam@dukesxi.co>", "to":emailList,"cc":cc,"subject":subject,"text":""})

def mailMessage(messageBody,title,sender):
    message ='<html><body style="margin:0"><div style="text-align: center;background-color: #eee;width:100%;margin:0;padding:30px 0;font-family:Helvetica Neue Light, Lucida Grande, Helvetica, Arial;font-size: 12px;"><div style="width:96%;max-width:660px;margin:0 auto;"><table style="color:#000;background-color: #eee;margin: 10px auto; border: none;border-collapse: collapse;width: 100%;"><tbody><tr><td style="width:15%;text-align: left;"><img style="width: 80px;height: 80px;" src="http://www.dukesxi.co/images/Dukes+logo+red.jpg"></td><td style="width:85%;text-align: left;"><h1 style="font-size: 22px;padding-bottom: 5px;font-weight: bold;margin:0;">'+title+'</h1><div style="color: #689;">Message initiated by <span style="font-weight: bold;"> '+sender+'</div></td></tr></tbody></table><table style="color:#000;background-color:#fff;margin:10px auto;border:none;border-collapse:collapse;width:100%;"><tbody><tr><td style="text-align: left;font-size: 14px;padding: 30px;height: 400px;vertical-align: top;">'
    message += messageBody;
    message +='</td></tr></tbody></table></div></div></body></html>'
    return message
