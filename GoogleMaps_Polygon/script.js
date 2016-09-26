//San Diego - Initial view of the map
var initLocation = {
    lat: 32.7157,
    lng: -117.1611
};

//zips for manhattan
var zips = [10012, 10013, 10014,10004, 10005, 10006, 10007, 10038, 10280,10002, 10003, 10009,10021, 10028, 10044, 10065, 10075, 10128];

//ref to the map object
var map = null;
var polygons = [];

/********************************************************************
 * this will be called by the google maps script that is
 * loaded in the previous step
 ********************************************************************/
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: initLocation,
        mapTypeId: 'terrain'
    });
}



(function () {

    /********************************************************************
     * Load the other JS scripts dynamically. In this case, the google
     * maps API must be loaded. Once loaded, i will call doStuff()
     ********************************************************************/
    var scriptsToLoad = [
        {
            src: "https://maps.googleapis.com/maps/api/js?key=AIzaSyA3Oa5uLCltGJkIyF5EVmUSQrz7-ujGdQA&callback=initMap",
            onload: doStuff
        }
    ];

    //load everything (dynamically insert script tags for each)
    scriptsToLoad.forEach(function (js, index) {
        var scriptTag = document.createElement("script");
        scriptTag.src = js.src;
        scriptTag.type = 'text/javascript';
        if (js.hasOwnProperty('onload')) scriptTag.onload = js.onload;
        document.body.appendChild(scriptTag);
    });

    //references to UI elements
    var button = document.getElementById("btnGet");
    var loader = document.getElementById("spinner");
    var label = button.innerHTML;


    /********************************************************************
     * Script loading is complete, do this next
     ********************************************************************/
    function doStuff() {

        button.onclick = function () {

            //form the URL to pull zips from my server
            var url = "http://ec2-54-186-98-197.us-west-2.compute.amazonaws.com/getZipCodeBound/";
            zips.forEach(function (code) {
                url = url + "&" + code
            });
            
            //hide the button text, show the spinner
            button.innerHTML = ""
            show(spinner);
            
            //remove any existing polygons that might be there
            polygons.forEach(function(polygon){
               if(polygon) polygon.setMap(null); 
            });

            //GET the data 
            var xhttp;
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                drawDataOnMap(xhttp.response, map);
            };

            xhttp.open("GET", url, true);
            xhttp.send();
        }

    }


    /********************************************************************
     * when the zip code data is fetched, this function is called to 
     * obtain the polygons and draw them on the google map
     ********************************************************************/
    function drawDataOnMap(response, map) {

        try {
            //parse the json string to get the response object
            //this is a list of objects
            //invalid objects will be null
            response = JSON.parse(response);

            //filter this to get actual valid objects
            validZipCodes = response.filter(function (item) {
                return !(item == null);
            })

            //if there are valid zip codes that can be plotted,
            //get their respective google map Polygons and draw
            //them on the map

            if (validZipCodes.length > 0 && map) {

                polygons = getGoogPolygons(validZipCodes); //get the polygons for these zip codes
                var newCenter = validZipCodes[0].center; //get the lat,lng of center of the first zip code
                var latLngCenter = new google.maps.LatLng(newCenter.lat, newCenter.lng); //turn that to a google maps LatLng
                map.panTo(latLngCenter); //pan the map to this lat,lng value

                //draw each of these polygons onto the map
                polygons.forEach(function (polygon) {
                    polygon.setMap(map);
                })
            }
            
            button.innerHTML = label;
            hide(spinner);

        } catch (err) {
            //catch and discard SyntaxError
        }

    }

    /********************************************************************
     * This function returns the google map Polygons for the specified
     * boundaries. These polygons may be directly drawn on the map
     ********************************************************************/
    function getGoogPolygons(polyData) {

        if (!google.maps) throw "Google Maps object not found! Load the API first."

        var allPolygons = [];

        polyData.forEach(function (item, index) {

            var googPoly = new google.maps.Polygon({
                paths: item.boundaries,
                strokeColor: '#FF0000',
                strokeOpacity: 1,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.3
            });

            allPolygons.push(googPoly);
        });

        return allPolygons;
    }
    
    /********************************************************************
     * Some functions to toggle visibility of DOM elements
     ********************************************************************/
    function show(element){
        if(element) element.style.display = "inline";
    }
    
    function hide(element){
        if(element) element.style.display = "none";
    }

})();
