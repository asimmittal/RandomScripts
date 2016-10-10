module.exports = {
	
	/*********************************************************
	 * function to handle the KML data. Looks for various
	 * delimiters to discover the zip code and associated
	 * coordinates
	 *********************************************************/

	handleKmlContent: function (kmlString) {
		//everything is case sensitive
		var blockDelimiter = "</Placemark>";
		var zipStart = "<SimpleData name=\"GEOID10\">";
		var zipEnd = "</SimpleData>";
		var coordStart = "<coordinates>";
		var coordEnd = "</coordinates>";

		var zipCodeData = {};
		
		//split the content string
		var blocks = kmlString.split(blockDelimiter);
	
		//for every block parse out the zip and coords
		blocks.forEach(function (block) {
			
			//get all the indices
			var zipStartIndex = block.indexOf(zipStart, 0) + zipStart.length;
			var zipEndIndex = block.indexOf(zipEnd, zipStartIndex);
			var zipCodeString = (block.substring(zipStartIndex, zipEndIndex)).trim();
		
			//check if this zipcode string is all digits, if it is look for coords
			if (!isNaN(zipCodeString)) {

				var listCoordBlocks = [];
				
				//keep searching in this block until no more <coordinates> are found
				//every time you find <coordinates>...</coordinates>, reduce the
				//size of the block 
			
				do {
					var indexCoordStart = block.indexOf(coordStart) + coordStart.length;
					var indexCoordEnd = block.indexOf(coordEnd, indexCoordStart);
					var coordString = block.substring(indexCoordStart, indexCoordEnd);
					block = block.slice(indexCoordEnd);
				
					//we found a coord string. let's get an object with lat lng values
					coordString = cleanUp(coordString);
					listCoordBlocks.push(coordString);

				} while (block.indexOf(coordStart) >= 0);
				
				//store the list of coord blocks against this zipcode string
				zipCodeData[zipCodeString] = { 'coords': listCoordBlocks };
			}
		});

		return zipCodeData;
	},
	
	/*********************************************************
	 * function to handle the CSV data from the ZCTA data
	 *********************************************************/
	handleCsvContent: function (csvString) {

		var lines = csvString.split("\n");
		var zipCodeData = {};

		lines.forEach(function (each) {
			
			//if there is a " (double quote) in this line
			//chances are there is a string like <field>,<field>,"Fort Meade,Williamstown",<field>
			//which has commas that don't necessary represent delimiters for various fields
			//we don't need these fields so we'll simply replace anything between "..." with rubbish
			//therby overwriting the "," (comma) which will fuck up our split(',) calls 
			var isCrap = false;
			var delim = '"';
			var line = '';
			
			for(var i = 0; i < each.length; i++){
				var c = each.charAt(i);
				if(c == delim) isCrap = !isCrap;
				if(!isCrap) line += c;
				else line += '?';
			}
			
			//now that we've cleaned up our string 
			//now we're ready to split using the "," delimiter and grab our fields
			
			var fields = line.split(",");
			var zip = fields[0].trim();
			var type = fields[1].trim().toLowerCase();
			var city = fields[3].trim();
			var state = fields[6].trim();
			var lat = parseFloat(fields[12].trim());
			var lng = parseFloat(fields[13].trim());
			
			if (type != 'military') {
				var obj = { 'city': city,'state': state.toUpperCase(),'latCenter': lat,'lngCenter': lng };
				zipCodeData[zip] = obj;
			}
		});
		 
		//return the zipcode data
		return zipCodeData;
	}
};

/*****************************************************
	* turns a string of format 
	* "-120,46,0 -120,46" into 
	* ["46,-120/46,-120"]
	* raw string has longitudes before latitutes
	* we're simply swapping the order to get lat before long
*****************************************************/
function cleanUp(coordString) {
	var pairs = coordString.split(",0");
	var revPairs = [];
	
	//for every "lng,lat" pair, split it, swap to get "lat,lng"
	for(var i = 0; i < pairs.length; i++){
		var lat = parseFloat(pairs[i].split(",")[1]);
		var lng = parseFloat(pairs[i].split(","[0]));
		if(!isNaN(lat) && !isNaN(lng)){
			revPairs.push("" + lat + "," + lng);
		}
	}
	
	return revPairs.join("/");
}

function replaceAt(s,index, character) {
    return s.substr(0, index) + character + s.substr(index+character.length);
}