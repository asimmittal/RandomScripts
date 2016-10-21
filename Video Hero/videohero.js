var db = {
    baseDir: "content",
    data: [
        {
            message: "This is a nice message #1",
            video: "vid1.mp4",
            "url": "#1"
        },
        {
            message: "This is a nice message #2",
            video: "vid2.mp4",
            "url": "#2"
        },
        {
            message: "This is a nice message #3",
            video: "vid3.mp4",
            "url": "#3"
        },
        {
            message: "This is a nice message #4",
            video: "vid4.mp4",
            "url": "#2"
        }
    ]
};

///---------------------------------------------------------------
/// global data objects
///---------------------------------------------------------------
var lblChallenge = document.getElementById("lblChallenge");
var anchorTag = document.getElementById("link");
var elemVarText = document.getElementById("lblVarText");
var elemPgBar = document.getElementById("pgFill");
var videoTag = document.getElementById("video");
var videoSrc = document.getElementById("videoSrc_mp4");
var overlay = document.getElementById("overlay");
/*
 * Typing forward and backward effects
 * ------------------------------------
 * We want the text in the "lblVarText" to seem like its being
 * typed out and then erased, one character at a time. The text should
 * also remain center-aligned. It would have been a lot easier to do
 * if the text was left aligned as the starting point for remains flushed
 * left. However in a center aligned string, the starting position of the
 * string shifts depending on the size of the string.
 *
 * The way to hack around this is by always having the entire string in the
 * div (so the width of the div remains fixed) but having some characters
 * shown and others remain "transparent"
 *
 * e.g. string = "Win the war for talent"
 *      W<span>in the war for talent</span>
 *      Wi<span>n the war for talent</span>
 *      Win<span> the war for talent</span>
 *      
 * So the part in the <span> is styled to remain hidden because its transparent
 * The way to do this is run an interval based timer where each iteration of
 * the timer shifts index for the <span> by one character (left/right)
 **/

///-----------------------------------------------------------
/// function: type
/// Simulate the text being typed out, one char at a time
///-----------------------------------------------------------
function type(strText, elem, callback) {
    var indexSpan = 0;
    var timer = setInterval(function () {
        var shown = strText.substring(0, indexSpan);
        var hidden = "<span>" + strText.substring(indexSpan, strText.length) + "</span>";
        elem.innerHTML = shown + hidden;
        if (indexSpan >= strText.length) {
            clearInterval(timer);
            if (callback) callback();
        }
        else indexSpan++;
    }, 65);
}

///-----------------------------------------------------------
/// function: type
/// Simulate the text being erased, one char at a time
///-----------------------------------------------------------
function erase(strText, elem, callback) {
    var indexSpan = strText.length;
    var timer = setInterval(function () {
        var shown = strText.substring(0, indexSpan);
        var hidden = "<span>" + strText.substring(indexSpan, strText.length) + "</span>"
        elem.innerHTML = shown + hidden;
        if (indexSpan <= 0) {
            clearInterval(timer);
            if (callback) callback();
        }
        else indexSpan--;
    }, 55);
}

///---------------------------------------------------------------
/// progress bar related class modifiers (animate/reset)
///---------------------------------------------------------------
function animateProgBar(){
    elemPgBar.className = "anim_pgBar";
}

function resetProgBar(){
    elemPgBar.className = "init_pgBar"
}

///---------------------------------------------------------------
/// overlay related functions
///---------------------------------------------------------------
function reveal(){
    overlay.className = "overlay_show";
}

function hide(){
    overlay.className = "overlay_hide";
}

function reset(){
    overlay.className = "overlay_init";
}
///---------------------------------------------------------------
/// detect which transition is supported by this browser
///---------------------------------------------------------------
function whichTransitionEvent() {
    var t
        , el = document.createElement("fakeelement");
    var transitions = {
        "transition": "transitionend"
        , "OTransition": "oTransitionEnd"
        , "MozTransition": "transitionend"
        , "WebkitTransition": "webkitTransitionEnd"
    }
    for (t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
}

function revealVideo(){
    var vidPath = objects[objIndex].video;
    videoSrc.src = baseDir + "/" + vidPath;
    video.load();
    video.play();
    reveal();
}

///---------------------------------------------------------------
/// THIS IS WHERE THINGS GO DOWN... MAIN
///---------------------------------------------------------------

// Get the appropriate transitionEnd event type
// for this browser
var transitionEndEventTag = whichTransitionEvent();

elemPgBar.addEventListener(transitionEndEventTag, function(e){
    step3();
});

overlay.addEventListener(transitionEndEventTag, function(e){
   console.log(e); 
});


// this will track how many videos we've cycled through
var objIndex = 0;
var baseDir = db.baseDir;
var objects = db.data;
var strText = '';

    
///---------------------------------------------------------------
/// STEP 1 - This is the beginning
/// == Reset the progress bar
/// == grab the current object from the global db
/// == load the video source, text and anchor
/// == start the progress bar animation + text typewriter anim
///---------------------------------------------------------------
function step1(){
    console.log("---> Index",objIndex);
    
    //reset prog bar
    resetProgBar();
    
    //get the data
    var total = objects.length;
    var current = objIndex + 1;
    var strChallenge = "Challenge " + current + " of " + total;
    strText = objects[objIndex].message;
    var url = objects[objIndex].url;
    
    //prep all static content
    lblChallenge.innerHTML = strChallenge;
    anchorTag.href = url;
    
    //hide the video content
    //load it, play it, and reveal it
    reset();
    setTimeout(revealVideo,100);
    
    //start prog bar animation
    setTimeout(animateProgBar,100);
    
    //start text typewriter animation after a delay of 600ms
    //once this completes, perform step 2
    setTimeout(function(){
        type(strText,elemVarText,step2);
    },1000);
}

///---------------------------------------------------------------
/// STEP 2 - this is called when the typewriter effect completes
/// === we'll have to start the erase text effect soon
///---------------------------------------------------------------
function step2(){
    console.log("starting step 2");
    setTimeout(function(){
        erase(strText,elemVarText,hide);
    },1000);
}

function step3(){
    
    //count the last object
    objIndex++;
    
    //if we haven't finished showing all objects
    //go back to step 1
    if(objIndex < objects.length){
        step1();
    }
    else console.log("<<<STOP>>>")
}

step1();




