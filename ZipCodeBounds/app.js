/***********************************************************************
 * This script will parse data from two sources to create a consolidate
 * json file that contains zip code boundary data. The first source
 * is the US census bureau KML data. The second is the ZCTA data
 *
 * You can download sample files for both of these here:
 * https://www.dropbox.com/sh/w8rweu2d58p95ex/AADuf-ZKDJMmk_5sPLiN8ebCa?dl=0
 *
 * Usage:
 * $ node app.js <path_to_kml> <path_to_zcta>
 *
 * Output:
 * consolidated zip code data as a json file
***********************************************************************/

var os = require("os");
var path = require("path");
var fs = require("fs");
var helpers = require("./helper");

//clear the screen
if(os.platform() != 'win32'){
	process.stdout.write('\033c');
}

//the first two arguments to the process are paths
//the third argument is the actual parameter you sent
//this is the path to the KML file
var pathToKmlFile = process.argv[2];
var pathToCsvFile = process.argv[3];

//we'll store all the consolidated data here
var locData, csvData;

if (pathToKmlFile && pathToCsvFile) {
	
	console.log("Starting...");
	console.log("Handling KML data...");
	//read the kml file
	if (fs.existsSync(pathToKmlFile)) {
		var contents = fs.readFileSync(pathToKmlFile, 'utf-8');
		locData = helpers.handleKmlContent(contents);
	}
	else {
		console.log("ERROR ---> KML file doesn't exist!!");
		return;
	}
	
	console.log("Done with KML.","Parsing ZCTA data now...");
	
	//now read the CSV file and extract the data
	if (fs.existsSync(pathToCsvFile)) {
		var contents = fs.readFileSync(pathToCsvFile, 'utf-8');
		csvData = helpers.handleCsvContent(contents);
	}
	else {
		console.log("ERROR ---> CSV file doesn't exist!!");
		return;
	}
	
	console.log("Done. Combining the two data sources...");
	
	//now we have two data sets as JSON objects - locData, csvData
	//in each of these objects the keys are zipcodes
	var zips = Object.keys(csvData);
	zips.forEach(function (zipcode) {
		if (locData.hasOwnProperty(zipcode)) {
			var csvObj = csvData[zipcode]; // {city: 'new york', state: 'NY',...}
			var locObj = locData[zipcode]; // {coords:[...]}
			locObj['meta'] = csvObj; // {coords: [...], meta: {city:'new york',state:'ny'}}
		}
	});

	var numZips = (Object.keys(locData)).length;
	console.log("Done. JSONifying things into data.json...");

	//all the location data
	var json = JSON.stringify(locData,null,4);
	fs.writeFile('data.json', json, function(err){
		if(err) throw err;
		else console.log("---> Done!",numZips," zipcodes recorded\n\n");
	});
}
else console.log("Provide the KML and CSV file paths as command line arguments");



