// js code for the user.html page

// get the id of the current user from login.js file for
// currently logged in user.
var currentUserid = localStorage.getItem("currentUserid");
var currentKittenid = "";
var kittenIds = [];
var kittenNames = [];
var kittenAges = [];
var kittenWeights = [];
var kittenSizes = [];

$(document).ready(function(){
    console.log("hello from user.js");
    console.log("from user.js, currentUserid is ", currentUserid);
    // this function happens when the user clicks the button
    // to get the modal with the form to enter the name for a new kitten
    // It populates the specific user in the db with the kitten and metric schema
    $(document).on("click", "#createKitten", function(event) {
      event.preventDefault();
      // make an ajax call for the user to add a kitten name
      $.ajax({
        method: "GET",
        url: "/popUser/" + currentUserid
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
            url: "/createKitten/" + currentUserid,
            data: {
                name: $("#kittenNameInput").val().trim()
            }
        })
        .then(function(dataKittenUser) {
            console.log("User after creation of new kitten (dataKittenUser) in user.js: ", dataKittenUser);
            // save id of current (last created kitten)
            currentKittenid = dataKittenUser.kitten[dataKittenUser.kitten.length - 1];
            console.log("currentKittenid: " + currentKittenid);
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
            url: "/kittenMetrics/" + currentKittenid,
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
          });
    });

      // Now, this happens as the page loads.....
      // empty out the div that shows the user's current kittens and metrics
      $("#currentKittens").empty();
      // get the current user document
      $.getJSON("/getCurrentUser" + currentUserid, function(currentUser) {
        console.log("currentUser[0]: ", currentUser[0]);
        console.log("currentUser[0].kitten: ", currentUser[0].kitten);
        // this .forEach goes through each kitten of the user
        // It gets the kitten document and name of kitten, then
        // gets the array of metric Ids for each kitten. currenUser[0].kitten is an array
        
        currentUser[0].kitten.forEach(outerForEach);
        
          function outerForEach(item, index) {
            console.log("THE INDEX OF currentUser[0].kitten and value: " + index + " - " + item );
            $.getJSON("/getAKitten" + item, function(curkat) {
              // this logs the kitten's id and name
              // then, metric array and length
              console.log("curkat[0]._id: ", curkat[0]._id);
              console.log("curkat[0].name: ", curkat[0].name);
              // this prints to DOM while the .forEach goes through the array
              //$("#currentKittens").append("<h4>Kitten " + curkat[0].name + "</h4>");
              console.log("curkat[0].metric: ", curkat[0].metric);
              console.log("curkat[0].metric.length: " + curkat[0].metric.length);
              // trying to push the name data into the appropriate array, 
              // and writing them to DOM later, as well as inside the .forEach
              // kittenNames SHOULD be in order... but it's not
              // print kittenNames AFTER both .forEach
              kittenNames.push(curkat[0].name);
              console.log("kittenNames: " + kittenNames);
              // this prints the names to the DOM before calling the metric .forEach
              // using the array of names as it comes out of the .getJSON
              // $("#currentKittens").append("<h4>Kitten: " + 
              //   curkat[0].name + "</h4>");

              // here, going to add in the retrieval of each metric for each kitten again.
              //I don't think this works
              curkat[0].metric.forEach(innerForEach);
              function innerForEach(innerItem, innerIndex) {
              // logs the array of metric document id's
                console.log("THIS INNER metric, innerIndex and innerItem: " + innerIndex + " - " + innerItem);
                $.getJSON("/getAMetric" + innerItem, function(curmet) {
                  // logs the age of each metric document, then other fields
                  console.log("curmet[0].age: ", curmet[0].age);
                  console.log("curmet[0].weight: ", curmet[0].weight);
                  console.log("curmet[0].size: ", curmet[0].size);
                  kittenAges.push(curmet[0].age);
                  kittenWeights.push(curmet[0].weight);
                  kittenSizes.push(curmet[0].size);
                  console.log("kittenAges: " + kittenAges);
                  console.log("kittenWeights: " + kittenWeights);
                  console.log("kittenSizes: " + kittenSizes);
                  // Write info to DOM
                  // Currently, 2/17, asynch is still a problem. the info is not 
                  // being written in order of kitten ages.
                  // BUT, the info is correct for each kitten (and User)
                  // going to try pushing the info into the arrays (tried before, but not
                  // with .forEach)
                  // $("#currentKittens").append(
                  //   //"<h4>Kitten: " + 
                  //   //curkat[0].name + "</h4>
                  //   "<h5>Age: " + 
                  //   curmet[0].age + "<br>Weight: " +
                  //   curmet[0].weight + "<br>Length: " +
                  //   curmet[0].size + "</h5>");
                });
              }
              //take out the button to add metrics. Put the data-id on the name of the kitten
              // and make it the way user can add matrics.
              // $("#currentKittens").append("<button type='submit' id='submitNewKittenMetrics' data-id=" + 
              //   curkat[0]._id + ">Add Metrics</button>");
            });
          }
      }); 
  
  // this function lists out the current user's kitten names
  $(document).on("click", "#getAllKittensForEach", function(event) {
    event.preventDefault();
    // print out kitten Names to DOM
    console.log("INSIDE PRINTKITTENNAMES FUNCTION");
      // Now, write this info to the DOM.
      // Include a button to retrive an individual kittens metrics.
    console.log("kittenNames.length: " + kittenNames.length);
    for (i=0; i<kittenNames.length; i++) {
      $("#currentKittens").append("<h4>Kitten " +
       kittenNames[i] + "</h4>");
    }
      //empty out the kitten names array so user can click the button as needed
      // remember that the kittenNames array is buiilt (currently) when the page loads
    kittenNames = [];
  });
            
            // now for each metric (of each kitten), retrieve the data
//               curkat[0].metric.forEach(innerForEach);
//  // This is still not getting data in order.
//  // break it down further.
//  // Get the names, then write those to DOM with a button to retrive the metrics just for that
//  // kitten as the user needs
//                 function innerForEach(innerItem, innerIndex) {
//                 // logs the array of metric document id's
//                   console.log("THIS INNER metric, innerIndex and innerItem: " + innerIndex + " - " + innerItem);
//                   $.getJSON("/getAMetric" + innerItem, function(curmet) {
//                     // logs the age of each metric document, then other fields
//                     console.log("curmet[0].age: ", curmet[0].age);
//                     console.log("curmet[0].weight: ", curmet[0].weight);
//                     console.log("curmet[0].size: ", curmet[0].size);
//                     kittenAges.push(curmet[0].age);
//                     kittenWeights.push(curmet[0].weight);
//                     kittenSizes.push(curmet[0].size);
//                     console.log("kittenAges: " + kittenAges);
//                     console.log("kittenWeights: " + kittenWeights);
//                     console.log("kittenSizes: " + kittenSizes);
//                     // Write info to DOM
//                     // Currently, 2/17, asynch is still a problem. the info is not 
//                     // being written in order of kitten ages.
//                     // BUT, the info is correct for each kitten (and User)
//                     // going to try pushing the info into the arrays (tried before, but not
//                     // with .forEach)
//                     $("#currentKittens").append("<h4>" + 
//                       curkat[0].name + "</h4><button type='submit' id='submitNewKittenMetrics' data-id=" + 
//                       curkat[0]._id + ">Add Metrics</button><br><h5>Age: " + 
//                       curmet[0].age + "<br>Weight: " +
//                       curmet[0].weight + "<br>Length: " +
//                       curmet[0].size + "</h5>");
//                   });
//                 }
//             });
//           }
//        });
//      });  

    // This function is used as user clicks on the Add Metrics button (rendered from above)
    // to add metrics to an existing kitten
    $(document).on("click", "#submitNewKittenMetrics", function(event) {
      event.preventDefault();
      $("#newKittenMetricModal").modal("show");
      currentKittenid = $(this).attr("data-id");
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