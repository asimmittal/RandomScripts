const jsdom = require("jsdom");
const { JSDOM } = jsdom;

class DraftExpressScraper{
    
    static scrape(html) {
        
        //now that we have the html, let's turn it into a fake window object
        const dom = new JSDOM(html);

        //now that we have a fake dom object, let's use jquery to extract the DOM
        const $ = (require('jquery'))(dom.window);

        //step 1: find the table with class 'sorttable', get all rows
        var tbody = $('.sorttable > tbody');
        var rows = tbody.children('tr');
        var listPlayers = [];

        //step 2: scan every row for player data
        for (var j = 0; j < rows.length; j++) {
            var row = $(rows[j]);
            var cols = row.children('td');

            //we'll store all the player data in this object
            var player = {};

            for (var k = 0; k < cols.length; k++) {
                var col = $(cols[k]);
                var colHtml = col.html().trim().toLowerCase();

                //handle player name
                if (colHtml.indexOf("</a>") >= 0) {
                    var aTag = $.parseHTML(colHtml)[0];
                    colHtml = $(aTag).html().trim();
                }

                //handle any missing data
                if (!colHtml || colHtml == '-' || colHtml.length == 0) colHtml = null;

                //create the player object
                switch (k) {
                    case 0:
                        player['name'] = colHtml;
                        break;
                    case 1:
                        player['year'] = colHtml;
                        break;
                    case 2:
                        player['draftPick'] = colHtml;
                        break;
                    case 3:
                        player['height'] = colHtml;
                        break;
                    case 4:
                        player['heightWithShoes'] = colHtml;
                        break;
                    case 5:
                        player['wingspan'] = colHtml;
                        break;
                    case 6:
                        player['standingReach'] = colHtml;
                        break;
                    case 7:
                        player['max'] = colHtml;
                        break;
                    case 8:
                        player['maxReach'] = colHtml;
                        break;
                    case 9:
                        player['noStep'] = colHtml;
                        break;
                    case 10:
                        player['noStepReach'] = colHtml;
                        break;
                    case 11:
                        player['weight'] = colHtml;
                        break;
                    case 12:
                        player['bodyFat'] = colHtml;
                        break;
                    case 13:
                        player['handLength'] = colHtml;
                        break;
                    case 14:
                        player['handWidth'] = colHtml;
                        break;
                    case 15:
                        player['bench'] = colHtml;
                        break;
                    case 16:
                        player['agility'] = colHtml;
                        break;
                    case 17:
                        player['sprint'] = colHtml;
                        break;
                }
            }

            listPlayers.push(player);
        }

        return listPlayers;
    }
}

module.exports = DraftExpressScraper;