var db = {
    baseDir: "content",
    data: [
        {
            message: "This is a long message #1",
            video_mp4: "vid1.mp4",
            video_webm: "vid1.webm",
            poster: "vid1.png",
            url: "http://google.com"
        },
        {
            message: "This is a really long message #2",
            video_mp4: "vid2.mp4",
            video_webm: "vid2.webm",
            poster: "vid2.png",
            url: "http://google.com"
        },
        {
            message: "This is a message #3",
            video_mp4: "vid3.mp4",
            video_webm: "vid3.webm",
            poster: "vid3.png",
            url: "http://google.com"
        },
        {
            message: "This is a message #4",
            video_mp4: "vid4.mp4",
            video_webm: "vid4.webm",
            poster: "vid4.png",
            url: "http://google.com"
        }
    ]
};

///---------------------------------------------------------------
/// global data objects
///---------------------------------------------------------------

//DOM elements
var lblChallenge = document.getElementById("lblChallenge");
var anchorTag = document.getElementById("link");
var elemVarText = document.getElementById("lblVarText");
var elemPgBar = document.getElementById("pgFill");
var videoTag = document.getElementById("video");
var videoSrc_mp4 = document.getElementById("videoSrc_mp4");
var videoSrc_webm = document.getElementById("videoSrc_webm");
var overlay = document.getElementById("overlay");

// this will track how many videos we've cycled through
var objIndex = 0;
var baseDir = db.baseDir;
var objects = db.data;
var strText = '';

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
    var textCursor = document.getElementById('textCursor');
    if(textCursor) textCursor.style.display = 'inline';
    
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
/// function: erase
/// Simulate the text being erased, one char at a time
///-----------------------------------------------------------
function erase(strText, elem, callback) {
    var indexSpan = strText.length;
    var textCursor = document.getElementById('textCursor');
    
    var timer = setInterval(function () {
        var shown = strText.substring(0, indexSpan);
        var hidden = "<span id='textCursor'>" + strText.substring(indexSpan, strText.length) + "</span>"
        elem.innerHTML = shown + hidden;
        if (indexSpan <= 0) {
            clearInterval(timer);
            if(textCursor) textCursor.style.display = 'none';
            if (callback) callback();
        }
        else indexSpan--;
    }, 55);
}

///---------------------------------------------------------------
/// function: animateProgBar
/// begins the progress bar animation
///---------------------------------------------------------------
function animateProgBar(){
    elemPgBar.className = "anim_pgBar";
}

///---------------------------------------------------------------
/// function: resetProgBar
/// resets the progress bar to its initial state i.e. width = 0
///---------------------------------------------------------------
function resetProgBar(){
    elemPgBar.className = "init_pgBar"
}

///---------------------------------------------------------------
/// function: reveal
/// this causes the overaly element to fade away (lower its opacity)
/// to reveal the underlying content (the video)
///---------------------------------------------------------------
function reveal(){
    overlay.className = "overlay_show";
}

///---------------------------------------------------------------
/// function: hide
/// this causes the overlay element to fade back in (raise its opacity)
/// causing the underlying video content to be obscured
///---------------------------------------------------------------
function hide(){
    overlay.className = "overlay_hide";
}

///---------------------------------------------------------------
/// function: reset
/// this resets the overlay element to its initial state which
/// is a high opacity that obscures the content. However, there 
/// is no transition happening here
///---------------------------------------------------------------
function reset(){
    overlay.className = "overlay_init";
}

///---------------------------------------------------------------
/// function: whichTransitionEvent
/// This function returns a string that identifies the event for
/// transition ends. This string is browser specific
///---------------------------------------------------------------
function whichTransitionEvent() {
    
    //create a fake element
    var t, el = document.createElement("fakeelement");
    
    //these are the transition end event identifiers
    //for different browsers
    var transitions = {
        "transition": "transitionend"
        , "OTransition": "oTransitionEnd"
        , "MozTransition": "transitionend"
        , "WebkitTransition": "webkitTransitionEnd"
    }
    
    //check to see which one is supported by the DOM
    //in this browser and return it
    for (t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
}

///---------------------------------------------------------------
/// function: revealVideo
/// this function picks up the video pointed to by the current
/// object index, loads it and plays it. The call to "reveal()"
/// also fades the overlay out thereby revealing the video
///---------------------------------------------------------------
function revealVideo(){
    
    //get the data
    var vidPath_mp4 = objects[objIndex].video_mp4;
    var vidPath_webm = objects[objIndex].video_webm;
    var poster = objects[objIndex].poster;
    
    //put the data in the video tags
    videoSrc_mp4.src = baseDir + "/" + vidPath_mp4;
    videoSrc_webm.src = baseDir + "/" + vidPath_webm;
    videoTag.setAttribute('poster', baseDir + "/" + poster); 
    
    //load and play
    videoTag.load();
    videoTag.play();
    
    //reveal the video
    reveal();
}

///---------------------------------------------------------------
/// Attach an event listener. The sequence ends when the prog bar
/// has filled up completely. Let's add a listener to know when
/// that prog bar transition (width animation) has ended
///---------------------------------------------------------------
var transitionEndEventTag = whichTransitionEvent();

elemPgBar.addEventListener(transitionEndEventTag, function(e){
    step3();
});


    
///---------------------------------------------------------------
/// STEP 1 - This is the beginning
/// == Reset the progress bar
/// == grab the current object from the global db
/// == load the video source, text and anchor
/// == start the progress bar animation + text typewriter anim
///---------------------------------------------------------------
function step1(){
    
    //reset prog bar
    resetProgBar();
    
    //get the data from the current object
    var total = objects.length;
    var current = objIndex + 1;
    var strChallenge = "Challenge " + current + " of " + total;
    strText = objects[objIndex].message;
    var url = objects[objIndex].url;
    
    //prep all static text content
    lblChallenge.innerHTML = strChallenge;
    anchorTag.href = url;
    
    //reset the overlay - its completely opaque now
    reset();
    
    //asynchronously load the vide and play it
    setTimeout(revealVideo,100);
    
    //start prog bar animation
    setTimeout(animateProgBar,100);
    
    //start text typewriter animation after a delay
    //once this completes, perform step 2
    setTimeout(function(){
        type(
            strText,            //the final string as it should appear
            elemVarText,        //the dom element in which it should appear
            step2               //what to do next after typewriter effect is complete
        );
    },1000);
}

///---------------------------------------------------------------
/// STEP 2 - this is called when the typewriter effect completes
/// The typewriter effect is complete, we'll wait for a bit and 
/// then begin the erase text effect (backspace effect)
///---------------------------------------------------------------
function step2(){    
    setTimeout(function(){
        erase(
            strText,
            elemVarText,
            hide
        );        
    },1000);
}

///---------------------------------------------------------------
/// STEP 3 - This is called when the "progress bar" width transition
/// completes. Look up at the transitionEnd event listener. In this
/// step, we'll basically check to see if we've played all the videos
/// if we have, then we'll simply stop. If we haven't, we'll go back
/// to step 1
///---------------------------------------------------------------
function step3(){
    
    //count the last object
    objIndex++;
    
    //if we've finished showing everything,
    //point back to the first object
    if(objIndex >= objects.length){
        objIndex = 0;
    }
    
    //go back to step1
    step1();
}

///---------------------------------------------------------------
/// MAIN - let's tip the first domino. Begin step 1
///---------------------------------------------------------------
step1();




