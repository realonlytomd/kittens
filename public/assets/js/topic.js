// js code for the topic.html page
// Set up the timer variables - so timer will work after leaving the user page
var startCount;
var myTimer;

$(document).ready(function(){
  $(document).ready(function(){ feedKittenTimer(); });
  console.log("in topic.js, just set var startCount: " + startCount);
  startCount = parseInt(localStorage.getItem("startCount"));
  console.log("in topic.js, just getItem startCount: " + startCount);
  console.log("what is type of startCount: " + typeof startCount);
  myTimer = parseInt(localStorage.getItem("myTimer"));
  // what is myTimer? an integer? string? object? it's a number
  var currentUserLoggedIn = localStorage.getItem("currentUserLoggedIn");
  
  // simulate the click event of starting the feed the kitten time
  if (startCount > 0) {
    //$("#feedKitten").click();
    //$("input#feedKitten")[0].click();
    //setTimeout(function(){ $("#feedKitten").click()}, 100);
    //setTimeout(function(){ $("input#feedKitten")[0].click()}, 100);
    // $("#feedKitten")[0].mousedown();
    // $("#feedKitten")[0].mouseup();
     // what about mouseup?
    //jQuery().trigger(“mousedown”) or jQuery().trigger(“mouseup”);
    
    // just need to call the function clickFunction, not clicking the button
    // because that doesn't exist on the topics page.
    clickFunction();
    
  }


  console.log("hello from topic.js");
  console.log("in topics.js, currentUserLoggedIn: " + currentUserLoggedIn);
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
          console.log("data from creation of question (dataCreateQuestion) in topic.js: ", dataCreateQuestion);
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
    