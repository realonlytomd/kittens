// js code for the topic.html page
var currentUserLoggedIn;  // to test if this is a logged in user or just a visitor
currentUserLoggedIn = localStorage.getItem("currentUserLoggedIn");
$(document).ready(function(){
  console.log("hello from topic.js");
  // make sure visitors (not logged in Users) can't see the form to answer topics 
  if (currentUserLoggedIn === "false") {
    $("#loggedInTopicForm").hide();
    $("#visitorTopicForm").show();
  } else {
    $("#loggedInTopicForm").show();
    $("#visitorTopicForm").hide();
  }
  
// first, take submits from the user on topics and answers to topics
// and call the appropriate api
//empty out divs that show topics sections as page loads
  $("#topicsCurrent").empty();
  $("#unanswerQ").empty();

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
          console.log("data from creation of question (dbTopic) in topic.js: ", dataCreateQuestion);
      });
      $("#question").val("");
  });

  // submittin a topic and answer to db
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
    $("#topicsCurrent").empty();
    $("#unanswerQ").empty();
    $.getJSON("/getAllTopics", function(allTopics) {
      console.log("all topics from db, allTopics: ", allTopics);
      for (i = 0; i < allTopics.length; i++) {
        // need an if to test if allTopics[i].answer is ""
        // if so, then add a way to click on the topic
        // if not, then print as before
        if (allTopics[i].answer !== "") {
          $("#topicsCurrent").append("<h4 style='border-top: 2px solid black;'>Topic: </h4><p>" +
          allTopics[i].topic + "</p><h4>Answer: </h4><p>" +
          allTopics[i].answer + "</p>");
        } else {
          $("#unanswerQ").append("<h4 style='border-top: 2px solid black;'>Question: </h4><p class='answerMe'>" +
          allTopics[i].topic + "</p>");
        }
      }
    });
  });  
});
    