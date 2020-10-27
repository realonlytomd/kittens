// js code for the user.html page

// // require "require" as it's not typically client side
// var requirejs = require('requirejs');
// // require sort-ids npm
// var sortAges = requirejs("sort-ids");
// var reorder = requirejs("array-rearrange");
// Set up the timer variables
var startCount;
var myTimer;
// get the id of the current user from login.js file for
// currently logged in user.
var currentUserId = localStorage.getItem("currentUserId");
var currentUserLoggedIn;
var currentKittenId = "";
var kittenIds = [];
var kittenNames = [];
var kittenBreeds = [];
var kittenFurlengths = [];
var kittenFurcolors = [];
var kittenSexes = [];
var metricIds = [];
var kittenAges = [];
var kittenWeights = [];
var kittenSizes = [];
// these are needed across functions as they are sorted in one, and printed to DOM

var sortedMetricIds = [];
var sortedAges = [];
var sortedWeights = [];
var sortedSizes = [];

// boolean that is true when delete and edit buttons already exist in div somewhere
var littleButton = false;
// setting target for whatever the user actually clicks - an object?
var target;
// The id associated with metrics for deleting and editing, and the id of the kitten
var thisId;
var thisKittenId;
var thisAge;
var thisWeight;
var thisSize;

$(document).ready(function(){
  $(document).ready(function(){ feedKittenTimer(); });
  console.log("hello from user.js");
  console.log("from user.js, currentUserId is ", currentUserId);
  // This code is used if a user returns from the topics page,
  // or another page, and there is a feed kitten timer currently going off.
  // it acts as the same code in topic.js.
  startCount = parseInt(localStorage.getItem("startCount"));
  console.log("in user.js, getItem startCount: " + startCount);
  myTimer = parseInt(localStorage.getItem("myTimer"));
  // If a timer is running, bypass the click event to start timer function
  if (startCount > 0) {
    console.log("in user.js, testing if startCount > 0, startCount: " + startCount);
    clickFunction();
  } else {
    console.log("startCount is NOT greater than 0");
  }
  // insert a logout function
  $(document).on("click", "#logoutButton", function(event) {
    event.preventDefault();
    console.log("This is the logout function!");
    //
    // add modal to ask user if they are sure
    // and if a feed kitten timer is running
    // add a cancel timer button
    // need to set the variable startCount to zero in local storage
    localStorage.setItem("currentUserLoggedIn", "false");
    // post to db to update loggedIn to "false"
    // this is needed because loggedIn is set to true for the first time a user signs up
    $.ajax({
      method: "POST",
      url: "/logoutUser/" + currentUserId,
      data: {
        _id: currentUserId,
        loggedIn: "false"
      }
    })
    .then(function(userUpdate) {
      console.log("userUpdate: ", userUpdate);
    });
    window.location.replace("/");
    return;
  });
  // this function happens when the user clicks the button
  // to get the modal with the form to enter the name for a new kitten
  // It populates the specific user in the db with the kitten and metric schema
  $(document).on("click", "#createKitten", function(event) {
    event.preventDefault();
    // make an ajax call for the user to add a kitten name
    $.ajax({
      method: "GET",
      url: "/popUser/" + currentUserId
    })
      .then(function(dataCreateKitten) {
        // this is the current user with his fields populated to receive kitten name and metric data
        console.log("in user.js, dataCreateKitten, after User is populated: ", dataCreateKitten);
      });
  });
    

    // then, the user enters the name, etc. for a new kitten in the modal, and submits it.
    // that data for a new kitten is stored in the recently populated user document
  $(document).on("click", "#submitNewKitten", function(event) {
    event.preventDefault();
      $.ajax({
          method: "POST",
          url: "/createKitten/" + currentUserId,
          data: {
            name: $("#kittenNameInput").val().trim(),
            breed: $("#kittenBreedInput").val().trim(),
            furlength: $("#kittenFurlengthInput").val().trim(),
            furcolor: $("#kittenFurcolorInput").val().trim(),
            sex: $("#kittenSexInput").val().trim()
          }
      })
      .then(function(dataKittenUser) {
          console.log("User after creation of new kitten (dataKittenUser) in user.js: ", dataKittenUser);
          // save id of current (last created kitten)
          currentKittenId = dataKittenUser.kitten[dataKittenUser.kitten.length - 1];
          console.log("currentKittenId: " + currentKittenId);
          // empty out the input fields
          $("#kittenNameInput").val("");
          $("#kittenBreedInput").val("");
          $("#kittenFurlengthInput").val("");
          $("#kittenFurcolorInput").val("");
          $("#kittenSexInput").val("");
          // Hide the current modal, then bring up 2nd modal that allows user to enter kitten metrics.
          $("#newKittenModal").modal("hide");
          $("#newKittenMetricModal").modal("show");
        });
  });

  // then, the user enters the metrics for a kitten in the modal, and submits it.
  // that reference id is stored in the kitten document
  $(document).on("click", "#submitKittenMetrics", function(event) {
    event.preventDefault();
      $.ajax({
        method: "POST",
        url: "/kittenMetrics/" + currentKittenId,
        data: {
            age: $("#kittenAgeInput").val().trim(),
            weight: $("#kittenWeightInput").val().trim(),
            size: $("#kittenSizeInput").val().trim()
        }
      })
      .then(function(allDataKittenUser) {
          console.log("User after kitten metrics (allDataKittenUser) in user.js: ", allDataKittenUser);
          // empty out the input fields
          $("#kittenAgeInput").val("");
          $("#kittenWeightInput").val("");
          $("#kittenSizeInput").val("");
          // then hide this modal
          $("#newKittenMetricModal").modal("hide");
          // Previously, had reloaded page. Now, call function to get kitten data
          // Without interrupting the timer if it's currently running.
          //window.location.reload();
          getAllData();
        })
        .then(function() {
          console.log("insde 2nd .then after submitting new kitten metrics");
          writeKittenDom();
        });
  });

      // Now, this happens as the page loads.....
  getAllData();
      // AND, after a new kitten's metrics are entered.
      // That way, if the timer is running, a page reload happens, and interrupts
      // the timer - that won't happen.
  function getAllData() {
      // empty out the div that shows the user's current kittens and metrics
    $("#currentKittens").empty();
    // get the current user document
    $.getJSON("/getCurrentUser" + currentUserId, function(currentUser) {
      // console.log("currentUser[0]: ", currentUser[0]);
      // console.log("currentUser[0].name: ", currentUser[0].name);
      // console.log("currentUser[0].loggedIn: ", currentUser[0].loggedIn);
      // since loggedIn is always "false" in the db, it must be written over here
      // everytime the user's info is retrieved from the db
      currentUserLoggedIn = localStorage.getItem("currentUserLoggedIn");
      console.log("from localStorage, currentUserLoggedIn: " + currentUserLoggedIn);
      // need a timer to logout Users after a period of time.
      // add test here to see if user is logged in
      //
      if (currentUserLoggedIn === "true") {
        $("span#currentUser").text(currentUser[0].name);
        //console.log("currentUser[0].kitten: ", currentUser[0].kitten);
        // this .forEach goes through each kitten of the user
        // It gets the kitten document and name of kitten, then prints row of buttons
        // one for each kitten
        // currenUser[0].kitten is an array
        
        currentUser[0].kitten.forEach(outerForEach);
        
          function outerForEach(item, index) {
            //console.log("THE INDEX OF currentUser[0].kitten and value: " + index + " - " + item );
            $.getJSON("/getAKitten" + item, function(curkat) {
              // this prints the names to the DOM 
              // as a button, with that kitten's id as data-id
              $("#currentKittens").append("<button class='kittenButtons' type='submit' id='listMetrics' data-id=" +
                curkat[0]._id + ">" +
                curkat[0].name + "</button>");
            });
          }
      } else {
        // go back to login
        window.location.replace("/");
        return;
      }
    });
  }
   // this function lists an individual kitten's current metrics
   // based on the id of the kitten as attached to individual buttons
  $(document).on("click", "#listMetrics", function(event) {
    event.preventDefault();
    currentKittenId = $(this).attr("data-id");
    writeKittenDom();
  });
  
  // function called after a particular kitten button is clicked - gets and displays kitten data
  function writeKittenDom() {
    console.log("currentKittenId inside writeKittendom: " + currentKittenId);
    $("#kittenMetrics").empty();
      // gets the array of metrics associated with the current kitten
    $.getJSON("/getAKitten" + currentKittenId, function(curkat) {
      // appends the name of the current kitten and other constants
      $("#kittenMetrics").append("<h4>Kitten: " + 
      curkat[0].name + "<br>Breed: " +
      curkat[0].breed + "<br>Fur Length: " +
      curkat[0].furlength + "<br>Fur Color: " +
      curkat[0].furcolor + "<br>Sex: " +
      curkat[0].sex +  "</h4>");
      // print to DOM: button with id of kitten to add metrics to kitten
      $("#kittenMetrics").append("<button type='submit' id='submitNewKittenMetrics' data-id=" + 
        curkat[0]._id + ">Add Metrics</button><br>");
      console.log("curkat[0].metric: ", curkat[0].metric);
      console.log("curkat[0].metric.length: " + curkat[0].metric.length);

      // this .forEach goes through each metric id to obtain associated metrics from db
      curkat[0].metric.forEach(innerForEach);

      function innerForEach(innerItem, innerIndex) {
        console.log("THIS INNER metric, innerIndex and innerItem: " + innerIndex + " and " + innerItem);
        $.getJSON("/getAMetric" + innerItem, function(curmet) {
          console.log("this innerItem or _id: " + curmet[0]._id);
          console.log("curmet[0].age: ", curmet[0].age);
          console.log("curmet[0].weight: ", curmet[0].weight);
          console.log("curmet[0].size: ", curmet[0].size);
          //create the arrays of kitten metrics
          metricIds.push(curmet[0]._id);
          kittenAges.push(curmet[0].age);
          kittenWeights.push(curmet[0].weight);
          kittenSizes.push(curmet[0].size);
          console.log("kittenAges.length = " + kittenAges.length);
          console.log("curkat[0].metric.length = " + curkat[0].metric.length);
          // only print the arrays of kitten metrics to DOM if they are completely finished
          if (kittenAges.length === curkat[0].metric.length) {
            // perform sort function to get arrays in order of kitten ages
            console.log("metricIds: " + metricIds);
            console.log("kittenAges: " + kittenAges);
            console.log("kittenWights: " + kittenWeights);
            console.log("kittenSizes: " + kittenSizes);
            // now feed the arrays to the server side
            $.ajax({
              method: "GET",
              url: "/sortArrays/",
              data: {
                ids: metricIds,
                ages: kittenAges,
                weights: kittenWeights,
                sizes: kittenSizes
              }
            })
            .then(function(sortedMetrics) {
              console.log("from creation of sortedMetrcis: ", sortedMetrics);
              sortedMetricIds = sortedMetrics.ids;
              sortedAges = sortedMetrics.ages;
              sortedWeights = sortedMetrics.weights;
              sortedSizes = sortedMetrics.sizes;
              console.log("sortedMetricIds: " + sortedMetricIds);
              console.log("sortedAges: " + sortedAges);
              console.log("sortedWights: " + sortedWeights);
              console.log("sortedSizes: " + sortedSizes);
              // call the function to print arrays to the DOM
              showDom();
            });
          }
        });
      }
      // function to print the newly created arrays to the Dom
      // the first time, these arrays are not filled yet, printing nothing to DOM
      function showDom() {
        console.log("inside function showDom, kittenAges: " + kittenAges);
        console.log("inside function showDom, sortedAges: " + sortedAges);
          for (i=0; i<kittenAges.length; i++) {
            console.log("I'm INSIDE THE showDom FORLOOP");
            $("#kittenMetrics").append("<div class='metricInfo'><h5 class='metricGroup' data_idKitten=" + 
              currentKittenId + " data_id=" + 
              sortedMetricIds[i] + " data_age=" +
              sortedAges[i] + " data_weight=" +
              sortedWeights[i] + " data_size=" +
              sortedSizes[i] + ">Age: " +
              sortedAges[i] + " Weeks" + "<br>Weight: " +
              sortedWeights[i] + " Ounces" +"<br>Length: " +
              sortedSizes[i] + " Inches" +"</h5></div>");
          }
          //empty out arrays before clicking a new kitten
          metricIds = [];
          kittenAges = [];
          kittenWeights = [];
          kittenSizes = [];
          sortedMetricIds = [];
          sortedAges = [];
          sortedWeights = [];
          sortedSizes = [];
      }
    });
  }
 
 //  user clicks anywhere on document inside of nav and footer
  $(document).on("click", ".wrapper", function(event) {
    event.preventDefault();
    console.log("user has clicked on the wrapper!");
    console.log("littleButton is: " + littleButton);
    if (littleButton === true) { // the edit and delete buttons should be removed if clicked
      // anywhere but themselves
      console.log("Check to see if littleButton is true: " + littleButton);
      if ($(event.target).hasClass("littleX") || $(event.target).hasClass("littleE")) {
          // then user has clicked on one of the buttons,
          // and seperate functions will be called.
          console.log("User has clicked on a delete or edit buton!");
      } else { // user clicked somewhere other than the delete or edit button
        console.log("delete and edit buttons already exist, but were not chosen.");
        removeButtons();
      }
    } else { // needs to ask if the click event was on .metricGroup
      console.log("littlebutton should be false: " + littleButton);
          //  No little buttons, user must click on the metricGroup div
          // If metricInfo is clicked, no different than if user had clicked elsewhere
          // in wrapper
      if ($(event.target).hasClass("metricInfo")) {
        console.log("user clicked in metricInfo");
        //target = $(event.target)
      } else if ($(event.target).hasClass("metricGroup")) {
        console.log("user clicked in metricGroup");
        // .parent method adds the buttons to the metric Info div, even though
        // the group of metrics was clicked.
        target = $(event.target).parent();
        // First, the id associated with these metrics, and the id of the kitten
        thisId = $(event.target).attr("data_id");
        thisKittenId = $(event.target).attr("data_idKitten");
        thisAge = $(event.target).attr("data_age");
        thisWeight = $(event.target).attr("data_weight");
        thisSize = $(event.target).attr("data_size");
        console.log("AFTER clicked .metricGroup, thisID: "  + thisId + " and thisKittenId: " + thisKittenId);
        addButtons();
      } else { // user has clicked elsewhere than the metric info div
        console.log("the current target (click) is NOT the .metricGroup");
        // user has clicked somewhere on page but not on .metricInfo
        // don't do anything. (maybe here add if other classes are clicked??)
      }
    }
  });

  // This function addes the thick border and the delete and edit buttons to 
  // a clicked .metricGroup div. 
  function addButtons() {
    target.css({
      'border-width': '5px'
    });
    console.log("INSIDE addButtons, thisID: "  + thisId + " and thisKittenId: " + thisKittenId);
    // append the delete and edit buttons, with data of metric document id, and kitten document id
    target.append("<button type='button' class='btn btn-default btn-xs littleX' data_idKitten=" + 
    thisKittenId + " data_id=" + 
    thisId + "><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></button>");
    target.append("<button type='button' class='btn btn-default btn-xs littleE' data_idKitten=" + 
    thisKittenId + " data_id=" + 
    thisId + "><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button>");
      // set boolean to true that delete and edit buttons exist
    littleButton = true;
  }

  // This function removes the delete and edit buttons if they already exist. 
    function removeButtons() {
    $(".metricInfo").css({
        'border-width': '1px'
      });
    $(".littleX").remove();
    $(".littleE").remove();
    littleButton = false;
  }

  // Function to delete one set of metric info of a kitten, selected by user
  // PROBLEM! THE DATA ID AND KITTEN ID ISN'T GOING TO THE RIGHT TARGET WHEN IT'S CLICKED
  $(document).on("click", ".littleX", function(event) {
    event.preventDefault();
    console.log("Inside DELETE set of metric info!");
    removeButtons();
    // delete this group of metric info from the db,
    // First, the id associated with these metrics, and the id of the kitten
    thisId = $(this).attr("data_id");
    thisKittenId = $(this).attr("data_idKitten")
    console.log("AFTER clicking littleX, thisID: "  + thisId + " and thisKittenId: " + thisKittenId);
    // DELETE these specific metrics from the metrics collection
    $.ajax({
      method: "DELETE",
      url: "/metrics/delete/" + thisId
    })
      .then (function(dbMetric) { 
        console.log("dbMetric after delete: ", dbMetric); // shows a successful delete of 1 document
        // and then delete (or "pull") the reference to that just deleted document from the kitten document
        $.ajax({
          method: "POST",
          url: "/kittens/removeRef/" + thisKittenId,
          data: {metricId: thisId}
        })
          .then (function(dbKitten) {
            console.log("dbKitten after POST/kittens/overwrite/id: ", dbKitten);
            // still need to reload the metrics div
            writeKittenDom();
          });
      });
  });
  
  // Function to edit one set of metric info of a kitten, selected by user
  $(document).on("click", ".littleE", function(event) {
    event.preventDefault();
    console.log("Inside EDIT set of metric info!");
    $(".metricInfo").css({
      'border-width': '1px'
    });
    $(".littleX").remove();
    $(".littleE").remove();
    littleButton = false;
    // bring up modal to edit existing information for this group of kitten metrics
    // check if all the variables are correctly defined
    console.log("AFTER clicking littleE," +
    " thisID: "  + thisId + 
    " thisKittenId: " + thisKittenId +
    " thisAge:" + thisAge +
    " thisWeight:" + thisWeight +
    " thisSize:" + thisSize);
    $("#newKittenMetricModal").modal("show");
    $("#kittenAgeInput").val(thisAge);
    $("#kittenWeightInput").val(thisWeight);
    $("#kittenSizeInput").val(thisSize);
    // this sort of works, but NOT. It's adding to kitten metrics, not posting over 
    // and existing kitten metric.  So need to do a findOneAndUpdate I guess.
  });
      
    // This function is used as user clicks on the Add Metrics button (rendered from above)
    // to add metrics to an existing kitten, also while other metrics have been listed
  $(document).on("click", "#submitNewKittenMetrics", function(event) {
    event.preventDefault();
    $("#newKittenMetricModal").modal("show");
    currentKittenId = $(this).attr("data-id");
  });
});