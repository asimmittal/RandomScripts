#### Generates a specified number of clients that perform a GET request
#### at a specified interval (in seconds)
#### e.g. python manyclients.py 10 3 ---> spawn 10 clients every 3 seconds

import threading, sys, time, traceback
import urllib, json

baseUrl = "http://ec2-54-186-98-197.us-west-2.compute.amazonaws.com/getZipCodeBound/11102&92122&90"

def getURL(arg):
	url = baseUrl
		
	try:
		resp = json.loads(urllib.urlopen(url).read())
		print "-"*10 ,"Client ",arg,"-"*10
		print resp
		print "-"*30
	except:
		traceback.print_exc()
		print "xxx " + str(arg) + " Timed out"


if __name__ == "__main__":

	numClients = 1;
	interval = 1;

	try:
		numClients = int(sys.argv[1]);
		interval = int(sys.argv[2]);
	except:
		print 'Input is invalid. Using 1 client / 1 sec'

	while True:
		try:
			print '\n\n-----> Spawning ' + str(numClients) + ' clients for every ' + str(interval) + 'seconds'
			for i in range(0,numClients):
				t = threading.Thread(target=getURL,args=(i,))
				t.start()

			time.sleep(interval);
				
		except:
			break;


