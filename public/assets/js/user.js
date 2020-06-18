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
var kittenAges = [];
var kittenWeights = [];
var kittenSizes = [];
// these are needed across functions as they are sorted in one, and printed to DOM

var sortedAges = [];
var sortedWeights = [];
var sortedSizes = [];
$(document).ready(function(){ feedKittenTimer(); });
$(document).ready(function(){
  console.log("hello from user.js");
  console.log("from user.js, currentUserId is ", currentUserId);
  // insert a logout function
  $(document).on("click", "#logoutButton", function(event) {
    event.preventDefault();
    console.log("This is the logout function!");
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
  // // function to bring up the countdown clock to feed the kitten
  // $(document).on("click", "#feedKitten", function(event) {
  //   event.preventDefault();
  //   // need to get inputs from user on how long to set the timer for
  //   stopTimer();
  //   startCount = $("#startCount").val().trim();
  //   console.log("startCount: " + startCount);
  //   timer();
  // });

  // // timer function
  // function timer() {
  //   //this span is in a fixed div so user sees it on page while the
  //   //timer clock is running.
  //   $("span#timerDisplay").html(startCount);
  //   if (startCount <= 1) {
  //     $("span#timerLabel").text(" Minute Left");
  //     } else {
  //       $("span#timerLabel").text(" Minutes Left");
  //     }
  //   $("#feedTimer").show();
  //   startCount = startCount - 1;
  //   console.log("startCount = " + startCount);
  //   // add play a sound as startCount reaches 0
  //   myTimer = setTimeout(function(){ timer() }, 60000);
  //   if (startCount === -1) {
  //     $("#countForm").trigger("reset");
  //     $("#feedTheKitten").modal("show");
  //     stopTimer();
  //   }
  // }

  // //stop Timer function
  // function stopTimer() {
  //   clearTimeout(myTimer);
  //   //$("span#timerLabel").text("");
  //   $("#feedTimer").hide();
  // }

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
  // that id is stored in the kitten document
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
      console.log("currentUser[0]: ", currentUser[0]);
      console.log("currentUser[0].name: ", currentUser[0].name);
      console.log("currentUser[0].loggedIn: ", currentUser[0].loggedIn);
      // since loggedIn is always "false" in the db, it must be written over here
      // everytime the user's info is retrieved from the db
      currentUserLoggedIn = localStorage.getItem("currentUserLoggedIn");
      console.log("from localStorage, currentUserLoggedIn: " + currentUserLoggedIn);
      // need a timer to logout Users after a period of time.
      // add test here to see if user is logged in
      //
      if (currentUserLoggedIn === "true") {
        $("span#currentUser").text(currentUser[0].name);
        console.log("currentUser[0].kitten: ", currentUser[0].kitten);
        // this .forEach goes through each kitten of the user
        // It gets the kitten document and name of kitten, then prints row of buttons
        // one for each kitten
        // currenUser[0].kitten is an array
        
        currentUser[0].kitten.forEach(outerForEach);
        
          function outerForEach(item, index) {
            console.log("THE INDEX OF currentUser[0].kitten and value: " + index + " - " + item );
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
    $("#kittenMetrics").empty();
    currentKittenId = $(this).attr("data-id");
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
        console.log("THIS INNER metric, innerIndex and innerItem: " + innerIndex + " - " + innerItem);
        $.getJSON("/getAMetric" + innerItem, function(curmet) {
          console.log("curmet[0].age: ", curmet[0].age);
          console.log("curmet[0].weight: ", curmet[0].weight);
          console.log("curmet[0].size: ", curmet[0].size);
          //create the arrays of kitten metrics
          kittenAges.push(curmet[0].age);
          kittenWeights.push(curmet[0].weight);
          kittenSizes.push(curmet[0].size);
          console.log("kittenAges.length = " + kittenAges.length);
          console.log("curkat[0].metric.length = " + curkat[0].metric.length);
          // only print the arrays of kitten metrics to DOM if they are completely finished
          if (kittenAges.length === curkat[0].metric.length) {
            // perform sort function to get arrays in order of kitten ages
            console.log("kittenAges: " + kittenAges);
            console.log("kittenWights: " + kittenWeights);
            console.log("kittenSizes: " + kittenSizes);
            // now feed the arrays to the server side
            $.ajax({
              method: "GET",
              url: "/sortArrays",
              data: {
                ages: kittenAges,
                weights: kittenWeights,
                sizes: kittenSizes
              }
            })
            .then(function(sortedMetrics) {
              console.log("from creation of sortedMetrcis: ", sortedMetrics);
              sortedAges = sortedMetrics.ages;
              sortedWeights = sortedMetrics.weights;
              sortedSizes = sortedMetrics.sizes;
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
            console.log("I'm INSIDE THE FOR LOOP");
            // finally, write info from db to DOM for user
            // $("#kittenMetrics").append("<h5>Age: " + 
            //   kittenAges[i] + "<br>Weight: " +
            //   kittenWeights[i] + "<br>Length: " +
            //   kittenSizes[i] + "</h5><br>");
            $("#kittenMetrics").append("<div class='metricInfo'><h5>Age: " +
              sortedAges[i] + " Weeks" + "<br>Weight: " +
              sortedWeights[i] + " Ounces" +"<br>Length: " +
              sortedSizes[i] + " Inches" +"</h5></div>");
          }
          //empty out arrays before clicking a new kitten
          kittenAges = [];
          kittenWeights = [];
          kittenSizes = [];
          sortedAges = [];
          sortedWeights = [];
          sortedSizes = [];
      }
    });
  });
      
      
    // This function is used as user clicks on the Add Metrics button (rendered from above)
    // to add metrics to an existing kitten, also while other metrics have been listed
  $(document).on("click", "#submitNewKittenMetrics", function(event) {
    event.preventDefault();
    $("#newKittenMetricModal").modal("show");
    currentKittenId = $(this).attr("data-id");
  });


  // take submits from the user on topics and answers to topics
  // and call the appropriate api to store in the topics db
  $("#topicsCurrent").empty();
  $(document).on("click", "#submitTopic", function(event) {
    event.preventDefault();
      $.ajax({
          method: "GET",
          url: "/createTopic",
          data: {
              topic: $("#topic").val(),
              answer: $("#answer").val()
          }
      })
      .then(function(dataCreateTopic) {
          console.log("data from creation of topic (dbTopic) in user.js: ", dataCreateTopic);
      });
      // empty out the input fields
      $("#topic").val("");
      $("#answer").val("");
  });
  // Include a button to load all the current topics from the topics db
  // This is the same as in the topics.js file as...
  // The function exists from both pages.
  
  $(document).on("click", "#loadTopics", function(event) {
    event.preventDefault();
    $("#topicsCurrent").empty();
    $.getJSON("/getAllTopics", function(allTopics) {
      console.log("all topics from db, allTopics: ", allTopics);
      for (i = 0; i < allTopics.length; i++) {
        $("#topicsCurrent").append("<h4 style='border-top: 2px solid black;'>Topic: </h4><p>" +
          allTopics[i].topic + "</p><h4>Answer: </h4><p>" +
          allTopics[i].answer + "</p>");
      }
    });
  });
});