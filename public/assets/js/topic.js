// js code for the topic.html page
// Set up the timer variables - so timer will work after leaving the user page
var startCount;
var myTimer;
var chosenQuestion;
var currentUserLoggedIn;

$(document).ready(function(){
  console.log("hello from topic.js");
  console.log("in topic.js, have just set var startCount: " + startCount);
  startCount = parseInt(localStorage.getItem("startCount"));
  console.log("in topic.js, just getItem startCount: " + startCount);
  //console.log("what is type of startCount?: " + typeof startCount);
  myTimer = parseInt(localStorage.getItem("myTimer"));
  // what is myTimer?  it's a number
  currentUserLoggedIn = localStorage.getItem("currentUserLoggedIn");
  console.log("in topics.js, currentUserLoggedIn: " + currentUserLoggedIn);
  // If a timer is running, bypass the click event to start timer function
  if (startCount > 0) {
    console.log("in topic.js, testing if startCount > 0, startCount: " + startCount);
    clickFunction();
  } else {
    console.log("startCount is NOT greater than 0");
  }

  // make sure visitors (not logged in Users) can't see the form to answer topics 
  if (currentUserLoggedIn === "false" || currentUserLoggedIn === null) {
    $("#loggedInTopicForm").hide();
    $("#visitorTopicForm").show();
    $("#unansweredTitle").hide();
    $("#answeredTitle").hide();
  } else {
    $("#loggedInTopicForm").show();
    $("#visitorTopicForm").hide();
    $("#unansweredTitle").hide();
    $("#answeredTitle").hide();
  }
  
// first, take submits from the user on topics and answers to topics
// and call the appropriate api
//empty out divs that show topics sections as page loads
  $("#unanswerQ").empty();
  $("#topicsCurrent").empty();
  

  // submitting a question for other users
  $(document).on("click", "#visitorQuestion", function(event) {
    event.preventDefault();
      $.ajax({
          method: "GET",
          url: "/createTopic",
          data: {
              topic: $("#question").val(),
              answer: ""
          }
      })
      .then(function(dataCreateQuestion) {
          console.log("data from creation of question (dataCreateQuestion) in topic.js: ", dataCreateQuestion);
      });
      $("#question").val("");
  });

  // submitting a topic and answer to db
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
          console.log("data from creation of topic (dbTopic) in topic.js: ", dataCreateTopic);
      });
      $("#topic").val("");
      $("#answer").val("");
  });

  $(document).on("click", "#loadTopics", function(event) {
    event.preventDefault();
    $("#unansweredTitle").show();
    $("#answeredTitle").show();
    $("#topicsCurrent").empty();
    $("#unanswerQ").empty();
    $.getJSON("/getAllTopics", function(allTopics) {
      console.log("all topics from db, allTopics: ", allTopics);
      for (i = 0; i < allTopics.length; i++) {
        // need an if to test if allTopics[i].answer is ""
        // if so, then add a way to click on the topic
        // if not, then print as before
        if (allTopics[i].answer !== "") {
          $("#topicsCurrent").append(
          "<h4 style='border-top: 2px solid black;'>Topic: </h4><p>" +
          allTopics[i].topic + "</p><h4>Answer: </h4><p>" +
          allTopics[i].answer + "</p>");
        } else {
          $("#unanswerQ").append(
          "<h4 style='border-top: 2px solid black;'>Question: </h4>" +
          "<p class='answerMe'>" + 
          allTopics[i].topic + "</p>");
        }
      }
    });
  });

  // if a user knows the answer to a question posed by another user
  $(document).on("click", ".answerMe", function(event) {
    event.preventDefault();
    // first, make sure the user is registered and logged in
    // should this be undefined???
    if (currentUserLoggedIn === "false" || currentUserLoggedIn === null) {
      $("#notLoggedIn").modal("show");
    } else {
      // the code .modal("show") brings up the modal from a click event, not .show() as used above
      // the value of the text of the chosen question to be used in the modal to get the answer
      $("#chosenQ").text($(this).text());
      chosenQuestion = $(this).text();
      console.log("chosenQuestion variable: " + chosenQuestion);
      $("#answerQuestion").modal("show");
    }
  });

  // submitting an answer to just a questions to the db
  $(document).on("click", "#submitNewAnswer", function(event) {
    event.preventDefault();
      $.ajax({
          method: "POST",
          url: "/answerTopic/" + chosenQuestion,
          data: {
              topic: chosenQuestion,
              answer: $("#newAnswer").val()
          }
      })
      .then(function(dataChosenQuestion) {
          console.log("data from putting answer to question (dataChosenQuestion) in db,topic.js: ", dataChosenQuestion);
      });
      $("#newAnswer").val("");
      $("#answerQuestion").modal("hide");
  });
});
    