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
    // build array of kitten pics
    var kittenPics = ["derp.jpg", "fours.jpg", "littlelady2.png", "pairs.jpg", "sleepy2.png"];
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
        kittenIndex = Math.floor(Math.random() * kittenPics.length);
        buildBackground();
        myTimer = setTimeout(function(){ timer() }, 7000);
    }

    // build the image function
    function buildBackground() {
        $("#carouselBackground").empty();
        var image = $("<img>");
        image.addClass("img-responsive");
        image.addClass("center-block");
        image.addClass("myImage");
        image.addClass("animated");
        image.addClass("slideInRight");
        image.attr("src", "assets/img/" + kittenPics[kittenIndex]);
        image.attr("alt", "cute");
        $("#carouselBackground").append(image);
        // now splice out this used index
        kittenPics.splice(parseInt(kittenIndex), 1);
        // if the last index has been removed, rebuild the array
        if (kittenPics.length === 0) {
            kittenPics = ["derp.jpg", "fours.jpg", "littlelady2.png", "pairs.jpg", "sleepy2.png"];
        }
    }
    
});