// js code for the user.html page

$(document).ready(function(){
    console.log("hello from user.js");
  // first, take submits from the user on topics and answers to topics
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
            console.log("data from creation of topic (dbTopic) in topic.js: ", dataCreateTopic);
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