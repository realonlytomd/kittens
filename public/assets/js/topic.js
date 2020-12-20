// js code for the topic.html page
// Set up the timer variables - so timer will work after leaving the user page
var startCount;
var myTimer;
var chosenQuestion;
var currentUserLoggedIn;
// get the name of the currently logged in user from local storage, for author needed
var currentUser = localStorage.getItem("currentUser");
var thisDiv;
console.log("topics.js: name of currentUser: " + currentUser);
// do I need to add the name of the current user? or get it from db with currentUserId??
// not sure: but I think in login.js, I can setStorage the currentUser name, and retrieve here,
// but I'll need to overwrite it when I logout,... done
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
  
  // This allows for a logged in User to jut ask a question.....
  // submitting a question for other users
  // add the author's name to the db. (and so the little x and edit)
  $(document).on("click", "#visitorQuestion", function(event) {
    event.preventDefault();
      $.ajax({
          method: "GET",
          url: "/createTopic",
          data: {
              topic: $("#question").val(),
              topicAuthor: "guest",
              answer: "",
              answerAuthor: ""
          }
      })
      .then(function(dataCreateQuestion) {
          console.log("data from creation of question (dataCreateQuestion) in topic.js: ", dataCreateQuestion);
      });
      $("#question").val("");
  });

  // submitting a topic and answer to db
  // add author's name
  $(document).on("click", "#submitTopic", function(event) {
    event.preventDefault();
      $.ajax({
          method: "GET",
          url: "/createTopic",
          data: {
              topic: $("#topic").val(),
              topicAuthor: currentUser,
              answer: $("#answer").val(),
              answerAuthor: currentUser
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
        // here, add a way to put the red x and red edit pencil on topics
        // and answers created by the author
        if (allTopics[i].answer !== "") {
          thisDiv = $("#topicsCurrent");
          thisDiv.append(
          "<h4 style='border-top: 2px solid black;'>Topic: </h4><p>" +
          allTopics[i].topic + "</p>");
          // if statement to determine if the current user is the same as the topic's author
          if (currentUser === allTopics[i].topicAuthor) {
            addLittleButtons();
          }
          thisDiv.append(
          "<h4>Answer: </h4><p>" +
          allTopics[i].answer + "</p>");
          if (currentUser === allTopics[i].answerAuthor) {
            addLittleButtons();
          }
        } else {
          thisDiv = $("#unanswerQ");
          thisDiv.append(
          "<h4 style='border-top: 2px solid black;'>Question: </h4>" +
          "<p class='answerMe'>" + 
          allTopics[i].topic + "</p>");
          if (currentUser === allTopics[i].topicAuthor) {
            addLittleButtons();
          }
        }
      }
    });
  });

  // This function adds the delete and edit buttons to topics and answers of the current user.
  function addLittleButtons() {
    console.log("INSIDE addLittleButtons");
    // append the delete and edit buttons, with data of ?
    thisDiv.append(
      "<button type='button' class='btn btn-default btn-xs littleX'>" +
      "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span></button>");
      thisDiv.append(
        "<button type='button' class='btn btn-default btn-xs littleE'>" +
      "<span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button>");
  }

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
  // need to figure out how to retrieve the original question's author
  $(document).on("click", "#submitNewAnswer", function(event) {
    event.preventDefault();
    console.log("inside function for a logged in user to asnwer a question, currentUser: " + currentUser);
      $.ajax({
          method: "POST",
          url: "/answerTopic/" + chosenQuestion,
          data: {
              topic: chosenQuestion,
              answer: $("#newAnswer").val(),
              answerAuthor: currentUser
          }
      })
      .then(function(dataChosenQuestion) {
          console.log("data from putting answer to question (dataChosenQuestion) in db,topic.js: ", dataChosenQuestion);
      });
      $("#newAnswer").val("");
      $("#answerQuestion").modal("hide");
  });
});
    