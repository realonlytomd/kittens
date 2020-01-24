// js code for the user.html page

// get the id of the current user from login.js file for
// currently logged in user.
var currentUserid = localStorage.getItem('currentUserid');

$(document).ready(function(){
    console.log("hello from user.js");
    console.log("from user.js, currentUserid is ", currentUserid);
    // when entering a new kitten, first, the current user's id 
    // needs to be retrieved
    // and should be sent to
    // the api so that user's document can be populated with the kitten array

    // this function happens when the user clicks the button
    // to get the modal with the forms to enter info for a new kitten
    // It populates the specific user in the db with the kitten schema
    $(document).on("click", "#createKitten", function(event) {
      event.preventDefault();
      // Nmake an ajax call for the article that the user wants to add a note
      $.ajax({
        method: "GET",
        url: "/popKitten/" + currentUserid
      })
        .then(function(dataCreateKitten) {
        console.log("in user.js, dataCreateKitten, after User is populated: ", dataCreateKitten);
        });
    });
    

    // then, the user enters info about the kitten, and submits it.
    // that data for a new kitten is stored in the recently populated user document
    // below, GET is wrong, should be post, as we're writing to the newly populated document
    $(document).on("click", "#submitNewKitten", function(event) {
      event.preventDefault();
        $.ajax({
            method: "POST",
            url: "/createKitten/" + currentUserid,
            data: {
                kittenName: $("#kittenNameInput").val().trim(),
                kittenWeight: $("#kittenWeightInput").val().trim(),
                kittenLength: $("#kittenLengthInput").val().trim()
            }
        })
        .then(function(dataNewKitten) {
            console.log("data from creation of new kitten (dataNewKitten) in user.js: ", dataNewKitten);
        });
        // empty out the input fields
        $("#kittenNameInput").val("");
        $("#kittenWeightInput").val("");
        $("#kittenLengthInput").val("");
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