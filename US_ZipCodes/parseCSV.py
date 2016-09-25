import json

path = 'us_zip_codes.csv'
#### each line in this CSV looks like this:
#### 'Zip:,MT MEADOWS AREA,00012,40.2487,60,CA,44.92381,12,-120.959,147,"<Polygon><outerBoundaryIs><LinearRing><coordinates>-120.8435,40.249528,0.0 -121.061249,40.258326,0.0 -121.007911,40.301765,0.0 -120.8435,40.249528,0.0</coordinates></LinearRing></outerBoundaryIs></Polygon>"'

def trim(someString):
	""" helper function to trim leading / trailing whitespace """
	return someString.rstrip().lstrip()


def parseLine(line):
	""" parse a single line from the csv file, return appropriate JSON object """

	#get a line, split it into two parts - one contains the m
	line = trim(line.lower())
	index_lastComma = line.find("<polygon>")
	metaString = line[0:index_lastComma]
	boundString = line[index_lastComma:]

	#let's first process the meta string - contains zip, city, state, lat, lng
	metaItems = metaString.split(',')
	del metaItems[0]
	city = trim(metaItems[1])
	state = trim(metaItems[5])
	zipCode = trim(metaItems[2])

	lat_center = float(trim(metaItems[3]))
	lng_center = float(trim(metaItems[8]))

	#now lets process the geometry string
	startTag = "<coordinates>"
	endTag = "</coordinates>"
	indexCoords_start = boundString.find(startTag) + len(startTag)
	indexCoords_end = boundString.find(endTag)
	strCoordinates = boundString[indexCoords_start: indexCoords_end]

	#now we have a string of coordinates that defines the geometry of the zip code
	#in 'strCoordinates'. Here after every (lng,lat) pair a '0.0 ' appears. This will
	#be our delimiter

	delimiter = "0.0 "
	coordPairs = strCoordinates.split(delimiter)
	geometry = []

	for i in range(0,len(coordPairs)):
		
		#clean up each pair of lat,lng values
		coordPairs[i] = coordPairs[i].replace(delimiter, "")
		index_extraComma = coordPairs[i].rfind(",");
		coordPairs[i] = trim(coordPairs[i][0:index_extraComma])
		
		if coordPairs[i] == '':
			continue;

		#now we have a string that has the <lat> and <lng> values
		#separated by a single comma. Also lng occurs before lat values
		lng,lat = coordPairs[i].split(",")

		#they're still strings, let's convert these to floats
		lat,lng = float(lat),float(lng)

		#append them as a tuple in the list
		geometry.append({'lat': lat, 'lng': lng})

	#we have everything we need now, compose the object and return it
	result = {}
	result['zipCode'] = zipCode
	result['city'] = city
	result['state'] = state
	result['center'] = {'lat':lat_center,'lng':lng_center}
	result['boundaries'] = geometry
	return result



if __name__ == '__main__':

	content = open(path).readlines();
	dctZipCodeBounds = {}
	counter = 0
	
	#first line is the title line... delete it
	del content[0]

	print 'Processing CSV file...'

	for eachline in content:
		info = parseLine(eachline)
		zipCode = info['zipCode']
		dctZipCodeBounds[zipCode] = info
		counter += 1
		print counter,':',info['state'],"---->",zipCode
		

	#now we have a dictionary with all the zip codes
	#let's jsonify it
	fw = open("zipcodes.json","w")
	json.dump(dctZipCodeBounds,fw,indent=4);
	fw.close();
