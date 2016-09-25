var initLocation = {lat: 40.712, lng: -74.005};         //lat,lng of NYC
var map = null;                                         //ref to the map object

/********************************************************************
* STEP 1 - load scripts
    * Called when 'script.js' is loaded. This function will 
    * dynamically load the Google Maps API script and other JS
    * scripts that we'll need
********************************************************************/
(function(){
    
    //list of scripts I want to load
    var scriptsToLoad = [
        {
            src:"https://maps.googleapis.com/maps/api/js?key=AIzaSyA3Oa5uLCltGJkIyF5EVmUSQrz7-ujGdQA&callback=initMap",
            onload: doStuff
        },
        
        {
            src:"helper.js"
        },
    ];
    
    //load everything (dynamically insert script tags for each)
    scriptsToLoad.forEach(function(js,index){
        var scriptTag = document.createElement("script");
        scriptTag.src = js.src;
        scriptTag.type= 'text/javascript';
        if(js.hasOwnProperty('onload')) scriptTag.onload = js.onload;
        document.body.appendChild(scriptTag);
    });
    
})();


/********************************************************************
* STEP 2 - this will be called by the google maps script that is
* loaded in the previous step
********************************************************************/
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: initLocation,
        mapTypeId: 'terrain'
    });
}

/********************************************************************
* STEP 3 - do my own thing now that everything is properly loaded
********************************************************************/
function doStuff(){
    var inputZipCode = document.getElementById('inputZipCode');
}