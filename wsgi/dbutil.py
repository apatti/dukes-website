__author__ = 'apatti'
from pymongo import MongoClient
import os

if 'MONGODB_STRING' in os.environ:
    mongodb = os.environ['MONGODB_STRING']

def getdbObject():
    client = MongoClient(mongodb)
    db = client.dukesxi
    return db

