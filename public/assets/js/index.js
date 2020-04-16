// js file for the index.html page
// provides the changing src files for the carousel (currently)
// maybe something more interesting later
$(document).ready(function(){
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
        "<img class='img-responsive center-block myImage' src='assets/img/derp.jpg' alt='cuteone'>" +
        "</div>" +

        "<div class='item'>" +
        "<img class='img-responsive center-block myImage' src='assets/img/fours.jpg' alt='cutetwo'>" +
        "</div>" +

        "<div class='item'>" +
        "<img class='img-responsive center-block myImage' src='assets/img/littlelady.png' alt='cutethree'>" +
        "</div>" +

        "<div class='item'>" +
        "<img class='img-responsive center-block myImage' src='assets/img/pairs.jpg' alt='cutefour'>" +
        "</div>" +

        "<div class='item'>" +
        "<img class='img-responsive center-block myImage' src='assets/img/sleepy.png' alt='cutefive'>" +
        "</div></div></div>");
});