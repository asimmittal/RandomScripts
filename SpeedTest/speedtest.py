from sys import platform
from subprocess import PIPE, Popen
from urllib2 import urlopen
import os,time
import speedtest_cli

def shell(command):
	"""
		Run any shell command and get its output. Blocks until
		output is returned
	"""
	process = Popen(args=command, stdout=PIPE, shell=True);
	return (process.communicate()[0]).lower().lstrip().rstrip();
	

def getSSID():
	""" 
		Get the current SSID. Returns '' if one doesn't exist
	"""
	cmd = "/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I | awk '/ SSID/ {print substr($0, index($0, $2))}'";
	return shell(cmd);


def isNetConnected():
	"""
		See if we have HTTP access
	"""
	try:
		out = urlopen("http://google.com").read();
		return True;
	except:
		return False;

def runSpeedTestAndGetDownloadUpload():
	"""
		run a speedtest using speedtest-cli, return upload and download
		results in Mbps
	"""
	result = speedtest_cli.speedtest();
	return (result[1], result[0]) # [0] = up, [1] = down


# MAIN
if __name__ == "__main__":

	try:

		homeDir = os.path.expanduser('~');
		outPath = homeDir + "/speedtest.txt";
		fileWriter = open(outPath,'a');
		logMsg = ''
		
		# Running on a mac?
		if platform.lower() == 'darwin':

			ssid = getSSID();
			isConn = isNetConnected();

			if isConn is True:
				# we're connected, run speed test and get down / up speed in Mbit/s
				down,up = runSpeedTestAndGetDownloadUpload();
				logMsg = str(time.time()) + "," + ssid + "," + "connected," + str(down) + "," + str(up)				
			else:
				# not connected to the internet... bummer
				logMsg = str(time.time()) + "," + "not connected"

		else:
			# not on a mac
			logMsg = 'not a mac'

		fileWriter.write(logMsg + os.linesep)
		fileWriter.close();
		print "Done without errors"

	except:
		print "Done with some error"


		
