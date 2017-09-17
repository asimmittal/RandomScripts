var express = require("express");
var portastic = require("portastic");

portastic.find({
    min: 5000,
    max: 8000,
}).then(function(ports) {

    if (ports.length > 0) {
        var portChosen = ports[0];
        var app = express();
        
        /**
         * route: root (/)
         * used to serve the entire directory as a static folder
         */
        app.use(express.static("./"));

        //start the server
        app.listen(portChosen, () => {
            console.log("---> Express server listening on port", portChosen);
        });
        
    } else throw "Couldn't find any free ports!";
});
