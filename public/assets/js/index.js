// js file for the index.html page
// provides the changing src files for the carousel (currently)
// maybe something more interesting later
$(document).ready(function(){
    // build array of kitten pics
    var kittenPics = ["derp.jpg", "fours.jpg", "littlelady.png", "pairs.jpg", "sleepy.png"];
    $("#carouselBackground").append("<div id='innerCar' class='carousel slide'" +
        " data-ride='carousel' data-interval='5000' data-wrap='true'>" +
        "<ol class='carousel-indicators'>" +
        "<li data-target='#innerCar' data-slide-to='0' class='active'></li>" +
        "<li data-target='#innerCar' data-slide-to='1'></li>" +
        "<li data-target='#innerCar' data-slide-to='2'></li>" +
        "<li data-target='#innerCar' data-slide-to='3'></li>" +
        "<li data-target='#innerCar' data-slide-to='4'></li>" +
        "</ol>" +
            
        "<div class='carousel-inner' role='listbox'>" +
        "<div class='item active'>" +
        "<img class='img-responsive center-block myImage' src='assets/img/" +
        kittenPics[0] +
        "' alt='cuteone'></div>" +

        "<div class='item'>" +
        "<img class='img-responsive center-block myImage' src='assets/img/" +
        kittenPics[1] +
        "' alt='cutetwo'></div>" +

        "<div class='item'>" +
        "<img class='img-responsive center-block myImage' src='assets/img/" +
        kittenPics[2] +
        "' alt='cutethree'></div>" +

        "<div class='item'>" +
        "<img class='img-responsive center-block myImage' src='assets/img/" +
        kittenPics[3] +
        "' alt='cutefour'></div>" +

        "<div class='item'>" +
        "<img class='img-responsive center-block myImage' src='assets/img/" +
        kittenPics[4] +
        "' alt='cutefive'></div></div></div>");
        $("#innerCar").carousel();
});