// js code for the topic.html page
// Set up the timer variables - so timer will work after leaving the user page
var startCount;
var myTimer;
var chosenQuestion;
var currentUserLoggedIn;
// get the name of the currently logged in user from local storage, for author needed
var currentUser = localStorage.getItem("currentUser");
var thisDiv;
var thisTopicId;
var thisTopicText;
var thisTopicAnswer;
console.log("topics.js: name of currentUser: " + currentUser);
// do I need to add the name of the current user? or get it from db with currentUserId??
// not sure: but I think in login.js, I can setStorage the currentUser name, and retrieve here,
// but I'll need to overwrite it when I logout,... done
jQuery.noConflict();
jQuery(document).ready(function( $ ){
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
  
  // This allows for a logged in User to just ask a question.....
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
        loadTheTopics();
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
        loadTheTopics();
      });
      $("#topic").val("");
      $("#answer").val("");
  });

  // click event when user clicks load Topics button
  $(document).on("click", "#loadTopics", function(event) {
    event.preventDefault();
    loadTheTopics();
  });

  // the function loadTheTopics
  function loadTheTopics() {
    
      $("#unansweredTitle").show();
      $("#answeredTitle").show();
      $("#topicsCurrent").empty();
      $("#unanswerQ").empty();
      $.getJSON("/getAllTopics", function(allTopics) {
        console.log("all topics from db, allTopics: ", allTopics);
        for (i = 0; i < allTopics.length; i++) {
          thisTopicId = allTopics[i]._id;
          thisTopicText = allTopics[i].topic;
          thisTopicAnswer = allTopics[i].answer;
          console.log("thisTopicID: " + thisTopicId + " thisTopicText: " + thisTopicText + " thisTopicAnswer: " + thisTopicAnswer);
          // need an if to test if allTopics[i].answer is ""
          // here, add a way to put the red x and red edit pencil on topics
          // and answers created by the author
          if (allTopics[i].answer !== "") {
            thisDiv = $("#topicsCurrent");
            thisDiv.append(
            "<h4 style='border-top: 2px solid black;'>Question: </h4><p>" +
            allTopics[i].topic + "</p>");
            // if statement to determine if the current user is the same as the topic's author
            if (currentUser === allTopics[i].topicAuthor) {
              addLittleButtonsTopic();
            }
            thisDiv.append(
            "<h4>Answer: </h4><p>" +
            allTopics[i].answer + "</p>");
            if (currentUser === allTopics[i].answerAuthor) {
              addLittleButtonsAnswer();
            }
          } else {
            thisDiv = $("#unanswerQ");
            thisDiv.append(
            "<h4 style='border-top: 2px solid black;'>Question: </h4>" +
            "<p class='answerMe'>" + 
            allTopics[i].topic + "</p>");
            if (currentUser === allTopics[i].topicAuthor) {
              addLittleButtonsTopic();
            }
          }
        }
      });
    
  }

  // This function adds the delete and edit buttons to topics or questions authored by the current user.
  function addLittleButtonsTopic() {
    
      console.log("INSIDE addLittleButtonsTopic, thisTopicID: " + thisTopicId);
      console.log("also inside addLittleButtonsTopic, thisTopicText: " + thisTopicText);
      console.log("also inside addLittlebuttonsTopic, thisTopicAnswer: " + thisTopicAnswer);
      // append the delete and edit buttons, with the id of the current topic as data
      thisDiv.append(
        "<button type='button' class='btn btn-default btn-xs littleXTopic' data_idtopic=" +
        thisTopicId + ">" +
        "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span></button>");
      var newEditButton = $("<span>");
      newEditButton.attr("type", "button");
      newEditButton.addClass("btn");
      newEditButton.addClass("btn-default");
      newEditButton.addClass("btn-xs");
      newEditButton.addClass("littleETopic");
      newEditButton.addClass("glyphicon");
      newEditButton.addClass("glyphicon-pencil");
      newEditButton.attr("aria-hidden", "true");
      newEditButton.attr("data-idtopic", thisTopicId);
      newEditButton.attr("data-texttopic", thisTopicText);
      newEditButton.attr("data-textanswer", thisTopicAnswer);
      thisDiv.append(newEditButton);
    
  }
  // This function adds the delete and edit buttons to answers authored by the current user.
  // I know: the only difference from addLittleButtonTopic is adding the class "littleEAnswer"
  // might look at later combining, just need an if statement to choose between topic or answer
  function addLittleButtonsAnswer() {
    
      console.log("INSIDE addLittleButtonsAnswer, thisTopicID: " + thisTopicId);
      console.log("also inside addLittlebuttonsAnswer, thisTopicText: " + thisTopicText);
      console.log("also inside addLittlebuttonsAnswer, thisTopicAnswer: " + thisTopicAnswer);
      // append the delete and edit buttons, with the id of the current topic as data
      thisDiv.append(
        "<button type='button' class='btn btn-default btn-xs littleXAnswer' data_idtopic=" +
        thisTopicId + ">" +
        "<span class='glyphicon glyphicon-remove' aria-hidden='true'></span></button>");
      var newEditButton = $("<span>");
      newEditButton.attr("type", "button");
      newEditButton.addClass("btn");
      newEditButton.addClass("btn-default");
      newEditButton.addClass("btn-xs");
      newEditButton.addClass("littleEAnswer");
      newEditButton.addClass("glyphicon");
      newEditButton.addClass("glyphicon-pencil");
      newEditButton.attr("aria-hidden", "true");
      newEditButton.attr("data-idtopic", thisTopicId);
      newEditButton.attr("data-texttopic", thisTopicText);
      newEditButton.attr("data-textanswer", thisTopicAnswer);
      thisDiv.append(newEditButton);
    
  }

  // if a user knows the answer to a question posed by another user
  $(document).on("click", ".answerMe", function(event) {
    event.preventDefault();
    // first, make sure the user is registered and logged in
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
          loadTheTopics();
      });
      $("#newAnswer").val("");
      $("#answerQuestion").modal("hide");
  });

  // A user clicks the red X under a Topic or Question to delete the entire Topic
  // this deletes the entire collection in the Topics db
  $(document).on("click", ".littleXTopic", function(event) {
    event.preventDefault();
    console.log("Inside DELETE the current user's Topic");
    // delete this entire topic from the db, using the topic's id number
    thisTopicId = $(this).attr("data_idtopic");
    console.log("AFTER clicking littleXTopic, thisTopicId: "  + thisTopicId);
    // DELETE these specific answer from the Topic collection
    $.ajax({
      method: "DELETE",
      url: "/topic/delete/" + thisTopicId
    })
      .then (function(dbTopic) {
        console.log("data from deleting Topic (dbTopic) in db,topic.js: ", dbTopic);
        loadTheTopics();
      });
  });

  // A user clicks the red X under an answer to a topic to delete their answer
  // also need to delete the name of the author from that answer
  $(document).on("click", ".littleXAnswer", function(event) {
    event.preventDefault();
    console.log("Inside DELETE the current user's answer");
    // overwrites this answer from the db, using the topic's id number
    thisTopicId = $(this).attr("data_idtopic");
    console.log("AFTER clicking littleXAnswer, thisTopicId: "  + thisTopicId);
    // DELETE these specific answer from the Topic collection
    $.ajax({
      method: "POST",
      url: "/overwriteAnswer/" + thisTopicId,
      data: {
        _id: thisTopicId,
        answer: "",
        answerAuthor: ""
      }
      })
      .then(function(dataTopicNoAnswer) {
        console.log("data from removing answer to question (dataTopicNoAnswer) in db,topic.js: ", dataTopicNoAnswer);
        loadTheTopics();
      });
  });

  // an author of a topic's question or topic clicks the red pen icon, and this function
  // brings up the modal to make the edit.
  $(document).on("click", ".littleETopic", function(event) {
    event.preventDefault();
    console.log("inside function to bring up modal to edit a topic's question");
    // need text of current answer to put in placeholder of form in modal
    $("h3#chosenQ").text($(this).attr("data-texttopic"));
    $("h3#prevAnswer").text($(this).attr("data-textanswer"));
    thisTopicId = $(this).attr("data-idtopic");
    console.log("after hitting little pen to edit, thisTopicId: " + thisTopicId);
    $("#editTopic").modal("show");
  });

  // Then, the user submits their new or edited answer and loads it into the db
  $(document).on("click", "#submitEditedTopic", function(event) {
    event.preventDefault();
    console.log("inside function for topic author to edit a their quetion, thisTopicId: " + thisTopicId);
      $.ajax({
          method: "POST",
          url: "/updateTopic/" + thisTopicId,
          data: {
            _id: thisTopicId,
            topic: $("#editedTopic").val()
          }
      })
      .then(function(dataChosenQuestion) {
        console.log("data from putting answer to question (dataChosenQuestion) in db,topic.js: ", dataChosenQuestion);
        loadTheTopics();
      });
      $("#editedTopic").val("");
      $("#editTopic").modal("hide");
  });

  // an author of a topic's answer clicks the red pen icon, and this function
  // brings up the modal to make the edit.
  $(document).on("click", ".littleEAnswer", function(event) {
    event.preventDefault();
    console.log("inside function to bring up modal to edit a topic's answer");
    // need text of current answer to put in placeholder of form in modal
    $("h3#chosenQ").text($(this).attr("data-texttopic"));
    $("h3#prevAnswer").text($(this).attr("data-textanswer"));
    thisTopicId = $(this).attr("data-idtopic");
    console.log("after hitting little pen to edit, thisTopicId: " + thisTopicId);
    $("#editAnswer").modal("show");
  });

  // Then, the user submits their new or edited answer and loads it into the db
  $(document).on("click", "#submitEditedAnswer", function(event) {
    event.preventDefault();
    console.log("inside function for answer author to edit a their answer, thisTopicId: " + thisTopicId);
      $.ajax({
          method: "POST",
          url: "/updateAnswer/" + thisTopicId,
          data: {
            _id: thisTopicId,
            answer: $("#editedAnswer").val()
          }
      })
      .then(function(dataChosenQuestion) {
        console.log("data from putting answer to question (dataChosenQuestion) in db,topic.js: ", dataChosenQuestion);
        loadTheTopics();
      });
      $("#editedAnswer").val("");
      $("#editAnswer").modal("hide");
  });
});
    