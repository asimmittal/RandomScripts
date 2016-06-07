import time
f = open("/Users/asim/log.dat","a");
f.write("Ran at " + str(time.time()))
f.close()