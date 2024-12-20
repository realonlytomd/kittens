// js file for the index.html page
// provides the changing src files for the carousel (currently)
// maybe something more interesting later
//
// I could animate the pic - but how to get it to repeat?
// I guess add a timer.... every 5 seconds, it changes?
// but isn't that built into animate.css?  just need the pic to change
// like it does in stressed (DHM), randome index in the kittenPics array,
// then after that's built, that index is spliced out, and a new one is picked
// according to the timer, not a click from a user.  (I could add that to stress pics too)

// set up variable for continuing the feed kitten timer if it is running
var startCount;
var myTimer;
jQuery.noConflict();
jQuery(document).ready(function($){
    //console.log(in index.js, have just set var startCount: " + startCount);
    startCount = parseInt(localStorage.getItem("startCount"));
    //console.log(in index.js, just getItem startCount: " + startCount);
    if (startCount > 0) {
        //console.log(in index.js, testing if startCount > 0, startCount: " + startCount);
        clickFunction();
      } else {
        //console.log(startCount is NOT greater than 0");
      }
    myTimer = parseInt(localStorage.getItem("myTimer"));
    // build array of kitten pics
    var kittenLandPics = ["alonewaterland.jpg", "angryishland.jpg", "angryland.jpg", 
        "beautyland.jpg", "boxland2.jpg", "browngrapland.jpg", "busterland2.jpg",
        "derpland2.jpg", "djkittyland.jpg", "fattyland.jpg", 
        "fourwaterland2.jpg", "groupland.jpg", "littleladyland.png", "momland2.jpg", 
        "pairsland2.jpg", "regalwaterland2.jpg", "scrambleland2.jpg", "screamland2.png", 
        "sleepy2land2.png", "threehugland.jpg", "threesland.jpg", "tubland2.jpg", "washland2.jpg",
        "cutegrayland.jpg", "gluegreenland.jpg"];
    var kittenPortPics = ["alonewaterport.jpg", "awport.jpg", "beansport.jpg", "beautyport.jpg", 
        "browngrayport.jpg", "busterport.jpg", "carseatport.jpg", "closeupport.jpg",
        "couchport.jpg", "cribport.jpg", "curlyport.jpg", "eyelineport.jpg", "eyeport.jpg", "eyesport.jpg",
        "faroffport.jpg", "fluffyport.png", "foursport.jpg", "furport.jpg", "grayport.jpg", "lisaderekport.jpg", "littlelady2port.png",
        "pairsport.jpg", "purplethreeport.jpg", "sadport.jpg", "sleepyport.jpg", "strangleport.jpg",
        "stunningport.jpg", "tinyport.jpg", "tongueport.jpg", "toofport.jpg", "tubport.jpg", "tuxport.jpg",
        "updownport.jpg", "whatport.jpg", "whiskersport.jpg", "whosport.jpg", "winnerport.jpg",
        "gray2port.jpg", 
        "xmasballport.jpg", "yellowcloseport.jpg", "busterkittenport.png"];
    var kittenIndex;
    
    // use animate to bring in a picture that changes from a timer function called interval
    //  so 1st, call the interval function
    interval();
    // the timer function
    function interval() {
        jQuery.noConflict();
        jQuery(document).ready(function($){
            // get a new randome new index
            if ($("button#topicButton").css("font-size") === "14px") {
                //console.log("In interval(), font-size should be 14: " + $("button#topicButton").css("font-size"));
                kittenIndex = Math.floor(Math.random() * kittenPortPics.length);
            } else {
                //console.log("In interval(), font-size should be 26: " + $("button#topicButton").css("font-size"));
                kittenIndex = Math.floor(Math.random() * kittenLandPics.length);
            }
                buildBackground();
                myTimer = setTimeout(function(){ interval() }, 7000);
        });          
    }

    // build the image function
    function buildBackground() {
        jQuery.noConflict();
        jQuery(document).ready(function($){
            //console.log("kittenIndex: " + kittenIndex);
            $("#carouselBackground").empty();
            var image = $("<img>");
            image.addClass("img-responsive");
            image.addClass("center-block");
            image.addClass("myImage");
            image.addClass("animated");
            image.addClass("fadeIn");
            if ($("button#topicButton").css("font-size") === "14px") {
                //console.log("In buildBackground(), fontsize should be 14: " + $("button#topicButton").css("font-size"));
                image.attr("src", "assets/img/" + kittenPortPics[kittenIndex]);
                //console.log(kittenIndex = " + kittenIndex);
            } else {
                //console.log("In buildBackground(), fontsize should be 26: " + $("button#topicButton").css("font-size"));
                image.attr("src", "assets/img/" + kittenLandPics[kittenIndex]);
                //console.log("kittenIndex = " + kittenIndex);
            }
            image.attr("alt", "cute");
            $("#carouselBackground").append(image);
            // now splice out this used index
            if ($("button#topicButton").css("font-size") === "14px") {
                //console.log("before splice: fontsize is 14: " + $("button#topicButton").css("font-size"));
                kittenPortPics.splice(parseInt(kittenIndex), 1);
                //console.log(kittenPortPics.length = " + kittenPortPics.length);
            } else {
                //console.log("before splice: fontsize is 26: " + $("button#topicButton").css("font-size"));
                kittenLandPics.splice(parseInt(kittenIndex), 1);
                //console.log(kittenLandPics.length = " + kittenLandPics.length);
            }
            // if the last index has been removed, rebuild the array
            if ((kittenPortPics.length === 0) || (kittenLandPics.length === 0)) {
                kittenLandPics = ["alonewaterland.jpg", "angryishland.jpg", "angryland.jpg", 
                "beautyland.jpg", "boxland2.jpg", "browngrapland.jpg", "busterland2.jpg",
                "derpland2.jpg", "djkittyland.jpg", "fattyland.jpg", 
                "fourwaterland2.jpg", "groupland.jpg", "littleladyland.png", "momland2.jpg", 
                "pairsland2.jpg", "regalwaterland2.jpg", "scrambleland2.jpg", "screamland2.png", 
                "sleepy2land2.png", "threehugland.jpg", "threesland.jpg", "tubland2.jpg", "washland2.jpg",
                "cutegrayland.jpg", "gluegreenland.jpg"];
                kittenPortPics = ["alonewaterport.jpg", "awport.jpg", "beansport.jpg", "beautyport.jpg", 
                "browngrayport.jpg", "busterport.jpg", "carseatport.jpg", "closeupport.jpg",
                "couchport.jpg", "cribport.jpg", "curlyport.jpg", "eyelineport.jpg", "eyeport.jpg", "eyesport.jpg",
                "faroffport.jpg", "fluffyport.png", "foursport.jpg", "furport.jpg", "grayport.jpg", "lisaderekport.jpg", "littlelady2port.png",
                "pairsport.jpg", "purplethreeport.jpg", "sadport.jpg", "sleepyport.jpg", "strangleport.jpg",
                "stunningport.jpg", "tinyport.jpg", "tongueport.jpg", "toofport.jpg", "tubport.jpg", "tuxport.jpg",
                "updownport.jpg", "whatport.jpg", "whiskersport.jpg", "whosport.jpg", "winnerport.jpg",
                "gray2port.jpg", 
                "xmasballport.jpg", "yellowcloseport.jpg", "busterkittenport.png"];
            }
        });
    }
    
    // check to see if user is already logged in and returned to home page
    // for whatever reason. If user is logged in, don't show the signup or login button
    var currentUserLoggedIn = localStorage.getItem("currentUserLoggedIn");
    if (currentUserLoggedIn === "true") {
        $("#signupButton").hide();
        $("#usersButton").show();
    } else {
        $("#signupButton").show();
        $("#usersButton").hide();
    }
    $.getJSON("/getAllTopics", function(allTopics) {
        var i = allTopics.length - 1;
        thisTopicText = allTopics[i].topic;
        $("#latestTopic").append("<h4>Latest Topic: " +
        thisTopicText + "</h4>");
    });
});