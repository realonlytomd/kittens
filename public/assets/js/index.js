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

$(document).ready(function(){
    // localStorage.setItem("currentUserLoggedIn", "false"); // all users are not logged in on index page
    // build array of kitten pics
    var kittenLandPics = ["alonewaterland.jpg", "angryishland.jpg", "angryland.jpg", 
        "beautyland.jpg", "boxland.jpg", "browngrapland.jpg", "busterland.jpg", 
        "chairland.jpg", "derpland.jpg", "djkittyland.jpg", "fattyland.jpg", 
        "fourwaterland.jpg", "groupland.jpg", "littleladyland.png", "momland.jpg", 
        "pairsland.jpg", "regalwaterland.jpg", "scrambleland.jpg", "screamland.png", 
        "sleepy2land.png", "threehugland.jpg", "threesland.jpg", "tubland.jpg", "washland.jpg"];
    var kittenPortPics = ["alonewaterport.jpg", "awport.jpg", "beansport.jpg", "beautyport.jpg", 
        "browngrayport.jpg", "busterport.jpg", "carseatport.jpg", "chairport.jpg", "closeupport.jpg",
        "couchport.jpg", "cribport.jpg", "curlyport.jpg", "eyelineport.jpg", "eyeport.jpg", "eyesport.jpg",
        "faroffport.jpg", "fluffyport.png", "foursport.jpg", "furport.jpg", "grayport.jpg", "littlelady2port.png",
        "pairsport.jpg", "purplethreeport.jpg", "sadport.jpg", "sleepyport.jpg", "strangleport.jpg",
        "stunningport.jpg", "tinyport.jpg", "tongueport.jpg", "toofport.jpg", "tubport.jpg", "tuxport.jpg",
        "updownport.jpg", "whatport.jpg", "whiskersport.jpg", "whosport.jpg", "winnerport.jpg", 
        "xmasballport.jpg", "yellowcloseport.jpg"];
    var kittenIndex;
    // $("#carouselBackground").append("<div id='innerCar' class='carousel slide'" +
    //     " data-ride='carousel' data-interval='5000' data-wrap='true'>" +
    //     "<ol class='carousel-indicators'>" +
    //     "<li data-target='#innerCar' data-slide-to='0' class='active'></li>" +
    //     "<li data-target='#innerCar' data-slide-to='1'></li>" +
    //     "<li data-target='#innerCar' data-slide-to='2'></li>" +
    //     "<li data-target='#innerCar' data-slide-to='3'></li>" +
    //     "<li data-target='#innerCar' data-slide-to='4'></li>" +
    //     "</ol>" +
            
    //     "<div class='carousel-inner' role='listbox'>" +
    //     "<div class='item active'>" +
    //     "<img class='img-responsive center-block myImage' src='assets/img/" +
    //     kittenPics[0] +
    //     "' alt='cuteone'></div>" +

    //     "<div class='item'>" +
    //     "<img class='img-responsive center-block myImage' src='assets/img/" +
    //     kittenPics[1] +
    //     "' alt='cutetwo'></div>" +

    //     "<div class='item'>" +
    //     "<img class='img-responsive center-block myImage' src='assets/img/" +
    //     kittenPics[2] +
    //     "' alt='cutethree'></div>" +

    //     "<div class='item'>" +
    //     "<img class='img-responsive center-block myImage' src='assets/img/" +
    //     kittenPics[3] +
    //     "' alt='cutefour'></div>" +

    //     "<div class='item'>" +
    //     "<img class='img-responsive center-block myImage' src='assets/img/" +
    //     kittenPics[4] +
    //     "' alt='cutefive'></div></div></div>");
    //     $("#innerCar").carousel();

    //  build an alternative to a carousel
    // use animate to bring in a picture that changes from a timer
    //  so 1st, call the timer
    timer();
    // the timer function
    function timer() {
        // get a new randome new index
        if ($("button#topicButton").css("font-size") === "14px") {
            //console.log("In timer(), font-size should be 14: " + $("button#topicButton").css("font-size"));
            kittenIndex = Math.floor(Math.random() * kittenPortPics.length);
        } else {
            //console.log("In timer(), font-size should be 26: " + $("button#topicButton").css("font-size"));
            kittenIndex = Math.floor(Math.random() * kittenLandPics.length);
        }
            buildBackground();
            myTimer = setTimeout(function(){ timer() }, 7000);
    }

    // build the image function
    function buildBackground() {
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
        } else {
            //console.log("In buildBackground(), fontsize should be 26: " + $("button#topicButton").css("font-size"));
            image.attr("src", "assets/img/" + kittenLandPics[kittenIndex]);
        }
        image.attr("alt", "cute");
        $("#carouselBackground").append(image);
        // now splice out this used index
        if ($("button#topicButton").css("font-size") === "14px") {
            //console.log("before splice: fontsize is 14: " + $("button#topicButton").css("font-size"));
            kittenPortPics.splice(parseInt(kittenIndex), 1);
        } else {
            //console.log("before splice: fontsize is 26: " + $("button#topicButton").css("font-size"));
            kittenLandPics.splice(parseInt(kittenIndex), 1);
        }
        // if the last index has been removed, rebuild the array
        if ((kittenPortPics.length === 0) || (kittenLandPics.length === 0)) {
            kittenLandPics = ["alonewaterland.jpg", "angryishland.jpg", "angryland.jpg", 
                "beautyland.jpg", "boxland.jpg", "browngrapland.jpg", "busterland.jpg", 
                "chairland.jpg", "derpland.jpg", "djkittyland.jpg", "fattyland.jpg", 
                "fourwaterland.jpg", "groupland.jpg", "littleladyland.png", "momland.jpg", 
                "pairsland.jpg", "regalwaterland.jpg", "scrambleland.jpg", "screamland.png", 
                "sleepy2land.png", "threehugland.jpg", "threesland.jpg", "tubland.jpg", "washland.jpg"];
            
            kittenPortPics = ["alonewaterport.jpg", "awport.jpg", "beansport.jpg", "beautyport.jpg", 
                "browngrayport.jpg", "busterport.jpg", "carseatport.jpg", "chairport.jpg", "closeupport.jpg",
                "couchport.jpg", "cribport.jpg", "curlyport.jpg", "eyelineport.jpg", "eyeport.jpg", "eyesport.jpg",
                "faroffport.jpg", "fluffyport.png", "foursport.jpg", "furport.jpg", "grayport.jpg", "littlelady2port.png",
                "pairsport.jpg", "purplethreeport.jpg", "sadport.jpg", "sleepyport.jpg", "strangleport.jpg",
                "stunningport.jpg", "tinyport.jpg", "tongueport.jpg", "toofport.jpg", "tubport.jpg", "tuxport.jpg",
                "updownport.jpg", "whatport.jpg", "whiskersport.jpg", "whosport.jpg", "winnerport.jpg", 
                "xmasballport.jpg", "yellowcloseport.jpg"];
        }
    }
    
});