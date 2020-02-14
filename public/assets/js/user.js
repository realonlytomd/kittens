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
    // currently, this is ONLY for entering a brand new kitten.
    // If a kitten already exists, and the user wants to enter new metrics,
    // THAT kitten's id will have to be retrieved - NEED TO DO THIS
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

    // This is a first attempt at getting all the existing kittens for a particular user
    // from the database, and the associated metrics for each kitten.
    // currently (2/12), arrays are getting pushed into incorrectly.
    // due to javascript's asynch??
    // can I push info into the arrays one kitten, and one set of metrics at a time???
    //
    $(document).on("click", "#getAllKittens", function(event) {
      event.preventDefault();
      // empty out the div that shows the user's current kittens and metrics
      $("#currentKittens").empty();
      // get the current user document
      $.getJSON("/getCurrentUser" + currentUserid, function(currentUser) {
        console.log("inside #getAllKittens, current user from db, currentUser: ", currentUser);
        console.log(currentUser[0]);
        //how many kittens in the user's document. It's an array of kitten references
        console.log("currentUser[0].kitten.length: " + currentUser[0].kitten.length);
        // this for loop goes through each kitten of the user
        // gets the kitten document and name of kitten, then
        // gets the array of metrics for each kitten
        for (i = 0; i < currentUser[0].kitten.length; i++) {
          // this logs the id's for each kitten to the console
          console.log("kitten[" + i + "]: " + currentUser[0].kitten[i]);
          $.getJSON("/getAKitten" + currentUser[0].kitten[i], function(curkat) {
            //this logs the full kitten object from the db
            console.log("curkat: ", curkat);
            // this logs the kitten's id and name
            console.log("curkat[0]._id: ", curkat[0]._id);
            console.log("curkat[0].name: ", curkat[0].name);
            // push each kitten id and name into a variable array kittenIds and kittenNames
            kittenIds.push(curkat[0]._id);
            kittenNames.push(curkat[0].name);
            // and then the array of metric id references  -- next, go through each metric
            console.log("curkat[0].metric: ", curkat[0].metric);
            console.log("curkat[0].metric.length: " + curkat[0].metric.length);
              //need a for loop to go through metrics
              for (j = 0; j < curkat[0].metric.length; j++) {
                // logs the array of metric document id's
                console.log("metric[" + j + "]: " + curkat[0].metric[j]);
                $.getJSON("/getAMetric" + curkat[0].metric[j], function(curmet) {
                  // logs the entire metric document
                  console.log("curmet: ", curmet);
                  // logs the age of each metric document, then other fields
                  console.log("curmet[0].age: ", curmet[0].age);
                  kittenAges.push(curmet[0].age);
                  console.log("curmet[0].weight: ", curmet[0].weight);
                  kittenWeights.push(curmet[0].weight);
                  console.log("curmet[0].size: ", curmet[0].size);
                  kittenSizes.push(curmet[0].size);
                });
              }
          });
        }
      });
    });

    // this is the 2nd attempt at getting all the kittens and metrics
    // instead of for loops, trying .forEach method.
    // the id of this function is changed to #getAllKittensForEach.
    // add a button for this.
    $(document).on("click", "#getAllKittensForEach", function(event) {
      event.preventDefault();
      // empty out the div that shows the user's current kittens and metrics
      $("#currentKittens").empty();
      // get the current user document
      $.getJSON("/getCurrentUser" + currentUserid, function(currentUser) {
        console.log("inside #getAllKittensForEach, current user from db, currentUser: ", currentUser);
        console.log("currentUser[0]: ", currentUser[0]);
        //how many kittens in the user's document. It's an array of kitten references
        console.log("this is this user's array of kitten id's: " + currentUser[0].kitten);
        console.log("currentUser[0].kitten.length: " + currentUser[0].kitten.length);
      
        // this .forEach goes through each kitten of the user
        // gets the kitten document and name of kitten, then
        // gets the array of metrics for each kitten
        //for (i = 0; i < currentUser[0].kitten.length; i++) {
        currentUser[0].kitten.forEach(myFunction);
        // function myFunction(item, index) {
        //   console.log("THIS! --- " + index + " : " + item ); 
        // }
      
          
            
           
          // this logs the id's for each kitten to the console
    //       
    //       $.getJSON("/getAKitten" + currentUser[0].kitten[i], function(curkat) {
    //         //this logs the full kitten object from the db
    //         console.log("curkat: ", curkat);
    //         // this logs the kitten's id and name
    //         console.log("curkat[0]._id: ", curkat[0]._id);
    //         console.log("curkat[0].name: ", curkat[0].name);
    //         // push each kitten id and name into a variable array kittenIds and kittenNames
    //         kittenIds.push(curkat[0]._id);
    //         kittenNames.push(curkat[0].name);
    //         // and then the array of metric id references  -- next, go through each metric
    //         console.log("curkat[0].metric: ", curkat[0].metric);
    //         console.log("curkat[0].metric.length: " + curkat[0].metric.length);
    //           //need a for loop to go through metrics
    //           // for (j = 0; j < curkat[0].metric.length; j++) {
    //           //   // logs the array of metric document id's
    //           //   console.log("metric[" + j + "]: " + curkat[0].metric[j]);
    //           //   $.getJSON("/getAMetric" + curkat[0].metric[j], function(curmet) {
    //           //     // logs the entire metric document
    //           //     console.log("curmet: ", curmet);
    //           //     // logs the age of each metric document, then other fields
    //           //     console.log("curmet[0].age: ", curmet[0].age);
    //           //     kittenAges.push(curmet[0].age);
    //           //     console.log("curmet[0].weight: ", curmet[0].weight);
    //           //     kittenWeights.push(curmet[0].weight);
    //           //     console.log("curmet[0].size: ", curmet[0].size);
    //           //     kittenSizes.push(curmet[0].size);
    //           //   });
    //           // }
    //       });
    //    //}
       });
     });
     function myFunction(item, index) {
      console.log("THIS! --- " + index + " : " + item ); 
    }
    

    $(document).on("click", "#showAllKittens", function(event) {
      event.preventDefault();
      // print out the built arrays
      console.log("building the arrays, kittenIds", kittenIds);
      console.log("building the arrays, kittenNames", kittenNames);
      console.log("building the arrays,  kittenAges", kittenAges);
      console.log("building the arrays KittenWeights", kittenWeights);
      console.log("building the arrays KittenSizes", kittenSizes);
      // print the resulting filled kitten arrays to the DOM
      console.log("SHOULD BE PRINTING TO DOM");
      $("#currentKittens").empty();
      for (i=0; i<kittenNames.length; i++) {
        $("#currentKittens").append("<h4>" + 
        kittenNames[i] + "</h4><button type='submit' id='submitNewKittenMetrics' data-id=" + 
        kittenIds[i] + ">Add Metrics</button><h5>" + 
        kittenAges[i] + "<br>" +
        kittenWeights[i] + "<br>" +
        kittenSizes[i] + "</h5>");
      }
      //empty out kitten arrays, they will be built over each time
      kittenIds = [];
      kittenNames = [];
      kittenAges = [];
      kittenWeights = [];
      kittenSizes = [];
    });

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