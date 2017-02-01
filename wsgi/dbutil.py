__author__ = 'apatti'
from pymongo import MongoClient
import os

if 'MONGODB_STRING' in os.environ:
    mongodb = os.environ['MONGODB_STRING']
else:
    mongodb = 'mongodb://dukesadmin:duke511@ds051665.mlab.com:51665/dukesxi'

def getdbObject():
    client = MongoClient(mongodb)
    db = client.dukesxi
    return db

