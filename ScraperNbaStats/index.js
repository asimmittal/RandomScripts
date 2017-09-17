
//packages we'll need
const curl = require("curl");
const Promise = require("promise");
const DraftExpressScraper = require("./de-scraper");
const fs = require("fs");

//base url
var draftExpBaseUrl = "http://www.draftexpress.com/nba-pre-draft-measurements/all/all/all/all/%";
const maxPages = 40;

//aggregate data
var allPlayerStats = [];

/**
 * fetch a single page of data from draftexpress.com, parse the big table
 * and get all the player data.
 * @param {*} pageNum 
 */
function fetch(pageNum){
	return new Promise( resolve => {
		let url = draftExpBaseUrl.replace("%",pageNum);
		
		curl.get(url, null, (err,resp,body)=>{
			if(resp.statusCode == 200){
				var playerData = DraftExpressScraper.scrape(body);
				for(var x in playerData) allPlayerStats.push(playerData[x]);
				if(pageNum == maxPages) saveData(allPlayerStats);
				resolve(pageNum);
			}
			else if(err){
				console.log("--> error in page", i);
				reject(pageNum);
			}
		})
	});
}

/**
 * turn the player data into a set of strings that will
 * be used to create a CSV file.
 * @param {*} data 
 */
function saveData(data){
	
	//let's first create the heading for the CSV, this is the title row
	var keys = [
		'name','year','draftPick','height','heightWithShoes',
		'wingspan','standingReach','max','maxReach','noStep',
		'noStepReach','weight','bodyFat','handLength','handWidth',
		'bench','agility','sprint'
	];

	var csvContent = keys.join(",") + "\n";
	  
	for(var x in data){
		var player = data[x];
		var playerString = "";

		for(var y in keys){ 
			var key = keys[y];
			playerString += player[key] + ",";
		}

		var lastCommaIndex = playerString.lastIndexOf(",");
		playerString = playerString.slice(0,lastCommaIndex);
		console.log("--->",playerString);
		
		csvContent += playerString + "\n";
	}

	var status = fs.writeFileSync("alldata.csv",csvContent);
	console.log("====> END OF FILE WRITE");
	process.exit();
}

var chain = Promise.resolve();

for(let i = 1; i <= maxPages; i++){
	chain = chain.then(()=>{ 
		fetch(i);
	});
}

