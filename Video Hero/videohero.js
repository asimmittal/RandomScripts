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
    
    var strText = "Win the war for talent";
    var elem = document.getElementById("lblVarText");
    
    ///-----------------------------------------------------------
    /// function: type
    /// Simulate the text being typed out, one char at a time
    ///-----------------------------------------------------------
    function type(callback){
        var indexSpan = 0;
        
        var timer = setInterval(function(){
            var shown = strText.substring(0,indexSpan);
            var hidden = "<span>" + strText.substring(indexSpan,strText.length) + "</span>";
            elem.innerHTML = shown + hidden;    
            
            if(indexSpan >= strText.length){ 
                clearInterval(timer);
                if(callback) callback();
            } 
            else indexSpan++;
        },65);
    }
    
    ///-----------------------------------------------------------
    /// function: type
    /// Simulate the text being erased, one char at a time
    ///-----------------------------------------------------------
    function erase(callback){
        var indexSpan = strText.length;
        
        var timer = setInterval(function(){
            var shown = strText.substring(0,indexSpan);
            var hidden = "<span>" + strText.substring(indexSpan,strText.length) + "</span>"
            elem.innerHTML = shown + hidden;
            
            if(indexSpan <= 0){ 
                clearInterval(timer); 
                if(callback) callback();
            }
            else indexSpan--;
        },65);
    }
    
   type(erase);
    