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
//these 2 can be removed?
var currentKittenId = "";
var kittenIds = [];
var kittenNames = [];
//these also aren't needed out of the function their created in
var kittenAges = [];
var kittenWeights = [];
var kittenSizes = [];
// these are needed across functions as they are sorted in one, and printed to DOM
// there will be many more metrics in future
var sortedAges = [];
var sortedWeights = [];
var sortedSizes = [];

$(document).ready(function(){
  console.log("hello from user.js");
  console.log("from user.js, currentUserId is ", currentUserId);

    // function to bring up the countdown clock to feed the kitten
  $(document).on("click", "#feedKitten", function(event) {
    event.preventDefault();
    // need to get inputs from user on how long to set the timer for
    // so need another modal
    // then the function to bring up the click on the DOM
    // and show the counting down clock
    // will need an alarm or whatever to show countdown has been reached
    stopTimer();
    startCount = 5;
    timer();
  });

  // timer function
  function timer() {
    //this span is in a fixed footer so user sees it on page while the
    //timer clock is running.
    $("#feedTimer").show();
    $("span#timerDisplay").html(startCount);
    startCount = startCount - 1;
    console.log("startCount = " + startCount);
    // add play a sound as startCount reaches 0
    myTimer = setTimeout(function(){ timer() }, 1000);
    if (startCount === -1) {
      stopTimer();
    }
  }

  //stop Timer function
  function stopTimer() {
    clearTimeout(myTimer);
    $("#feedTimer").hide();
  }

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
    

    // then, the user enters the name for a new kitten in the modal, and submits it.
    // that data for a new kitten is stored in the recently populated user document
  $(document).on("click", "#submitNewKitten", function(event) {
    event.preventDefault();
      $.ajax({
          method: "POST",
          url: "/createKitten/" + currentUserId,
          data: {
              name: $("#kittenNameInput").val().trim()
          }
      })
      .then(function(dataKittenUser) {
          console.log("User after creation of new kitten (dataKittenUser) in user.js: ", dataKittenUser);
          // save id of current (last created kitten)
          currentKittenId = dataKittenUser.kitten[dataKittenUser.kitten.length - 1];
          console.log("currentKittenId: " + currentKittenId);
          // empty out the input fields
          $("#kittenNameInput").val("");
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
          window.location.reload();
        });
  });

      // Now, this happens as the page loads.....
      // empty out the div that shows the user's current kittens and metrics
  $("#currentKittens").empty();
  // get the current user document
  $.getJSON("/getCurrentUser" + currentUserId, function(currentUser) {
    console.log("currentUser[0]: ", currentUser[0]);
    console.log("currentUser[0].name: ", currentUser[0].name);
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
          // this logs the kitten's id and name
          // then, metric array and length
          console.log("curkat[0]._id: ", curkat[0]._id);
          console.log("curkat[0].name: ", curkat[0].name);
          // this prints the names to the DOM 
          // as a button, with that kitten's id as data-id
          $("#currentKittens").append("<button class='kittenButtons' type='submit' id='listMetrics' data-id=" +
            curkat[0]._id + ">" +
            curkat[0].name + "</button>");
        });
      }
  });
   // this function lists an individual kitten's current metrics
   // based on the id of the kitten as attached to individual buttons
  $(document).on("click", "#listMetrics", function(event) {
    event.preventDefault();
    $("#kittenMetrics").empty();
    currentKittenId = $(this).attr("data-id");
    // gets the array of metrics associated with the current kitten
    $.getJSON("/getAKitten" + currentKittenId, function(curkat) {
      // appends the name of the current kitten
      $("#kittenMetrics").append("<h4>Kitten: " + curkat[0].name + "</h4>");
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
          // for checking: writing these to DOM will be removed later as the assembled
          // array of metrices must be sorted before printin to DOM
          // $("#kittenMetrics").append("<h5>oldAge: " + 
          //   curmet[0].age + "<br>oldWeight: " +
          //   curmet[0].weight + "<br>oldLength: " +
          //   curmet[0].size + "</h5><br>");
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
              sortedAges[i] + "<br>Weight: " +
              sortedWeights[i] + "<br>Length: " +
              sortedSizes[i] + "</h5></div>");
          }
          //empty out arrays before clicking a new kitten
          kittenAges = [];
          kittenWeights = [];
          kittenSizes = [];
          sortedAges = [];
          sortedWeights = [];
          sortedSizes = [];
          //this adds a button for user to add new metrics
          console.log("curkat[0]._id: " + curkat[0]._id);
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
        $("#topicsCurrent").append("<h4>Topic: </h4><p>" +
          allTopics[i].topic + "</p><h4>Answer: </h4><p>" +
          allTopics[i].answer + "</p><br />");
      }
    });
  });
});