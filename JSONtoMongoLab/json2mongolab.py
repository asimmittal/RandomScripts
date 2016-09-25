import json, os;
from pymongo import MongoClient
from pymongo import errors
from sys import stdout

filename = 'zipcodes.json'

#read all the json data and store it in 'data'
f = open(filename);
data = json.load(f);
f.close();

try:
	#connect to db
	dbServer = 'ds041506.mlab.com'
	dbPort = 41506
	client = MongoClient(dbServer,dbPort)
	db = client['asim-personal']
	db.authenticate('asim','password123')

	#get the collection
	coll_zipCodes = db.uszipcodes
	counter = 0;
	total = len(data.values())

	for each in data.values():
		progress = str(counter) + "/" + str(total)
		message = progress + " : " + each['zipCode'] + " ----> "
		stdout.write(message)
		coll_zipCodes.insert(each)
		stdout.write(" OK\n")
		counter+=1

except errors.OperationFailure:
	print 'Error connecting to DB'
