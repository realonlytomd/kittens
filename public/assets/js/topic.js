// js code for the topic.html page

$(document).ready(function(){
  console.log("hello from topic.js");
// first, take submits from the user on topics and answers to topics
// and call the appropriate api
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
      $("#topic").val("");
      $("#answer").val("");
  });

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
    