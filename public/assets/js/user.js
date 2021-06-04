// js code for the user.html page

// // require "require" as it's not typically client side
// var requirejs = require('requirejs');
// // require sort-ids npm
// var sortAges = requirejs("sort-ids");
// var reorder = requirejs("array-rearrange");
// Set up the timer variables
var startCount;
var myTimer;
// get the id of the current user from login.js file for
// currently logged in user.
var currentUserId = localStorage.getItem("currentUserId");
var currentUser = localStorage.getItem("currentUser");
var currentUserLoggedIn;
var currentKittenId = "";
var kittenIds = [];
var kittenNames = [];
var kittenBreeds = [];
var kittenFurlengths = [];
var kittenFurcolors = [];
var kittenSexes = [];
var metricIds = [];
var kittenAges = [];
var kittenWeights = [];
var kittenSizes = [];
// these are needed across functions as they are sorted in one, and printed to DOM

var sortedMetricIds = [];
var sortedAges = [];
var sortedWeights = [];
var sortedSizes = [];

// boolean that is true when delete and edit buttons already exist in div somewhere
var littleButton = false;
// setting target for whatever the user actually clicks - an object?
var target;
// The id associated with metrics for deleting and editing, and the id of the kitten
var thisId;
var thisKittenId;
var thisName;
var thisBreed;
var thisFurlength;
var thisFurcolor;
var thisSex;
var thisAge;
var thisWeight;
var thisSize;
var dataPointsArraySize = [];
var dataPointsArrayWeight = [];
jQuery.noConflict();
jQuery(document).ready(function( $ ){
  jQuery(document).ready(function( $ ){ feedKittenTimer(); });
  console.log("hello from user.js");
  console.log("from user.js, currentUserId is ", currentUserId);
  console.log("from user.js, currentUserLoggedIn is ", currentUserLoggedIn);
  // This code is used if a user returns from the topics page,
  // or another page, and there is a feed kitten timer currently going off.
  // it acts as the same code in topic.js.
  startCount = parseInt(localStorage.getItem("startCount"));
  console.log("in user.js, getItem startCount: " + startCount);
  myTimer = parseInt(localStorage.getItem("myTimer"));
  // If a timer is running, bypass the click event to start timer function
  if (startCount > 0) {
    console.log("in user.js, testing if startCount > 0, startCount: " + startCount);
    clickFunction();
  } else {
    console.log("startCount is NOT greater than 0");
  }
  // insert a logout function
  $(document).on("click", "#logoutButton", function(event) {
    event.preventDefault();
    console.log("This is the logout function!");
    //
    // add modal to ask user if they are sure
    // and if a feed kitten timer is running
    // add a cancel timer button
    // need to set the variable startCount to zero in local storage
    localStorage.setItem("currentUserLoggedIn", "false");
    localStorage.setItem("currentUser", "");
    // post to db to update loggedIn to "false"
    // this is needed because loggedIn is set to true for the first time a user signs up
    $.ajax({
      method: "POST",
      url: "/logoutUser/" + currentUserId,
      data: {
        _id: currentUserId,
        loggedIn: "false"
      }
    })
    .then(function(userUpdate) {
      console.log("userUpdate: ", userUpdate);
    });
    window.location.replace("/");
    return;
  });

  // this function happens when the user clicks the button
  // to get the modal with the form to enter the name, etc. for a new kitten
  // It populates the specific user in the db with the kitten and metric schema
  $(document).on("click", "#createKitten", function(event) {
    event.preventDefault();
    // make an ajax call for the user to add a kitten name
    $.ajax({
      method: "GET",
      url: "/popUser/" + currentUserId
    })
      .then(function(dataCreateKitten) {
        // this is the current user with his fields populated to receive kitten name and metric data
        console.log("in user.js, dataCreateKitten, after User is populated: ", dataCreateKitten);
      });
  });
    

    // then, the user enters the name, etc. for a new kitten in the modal, and submits it.
    // that data for a new kitten is stored in the recently populated user document
  $(document).on("click", "#submitNewKitten", function(event) {
    event.preventDefault();
      $.ajax({
          method: "POST",
          url: "/createKitten/" + currentUserId,
          data: {
            name: $("#kittenNameInput").val().trim(),
            breed: $("#kittenBreedInput").val().trim(),
            furlength: $("#kittenFurlengthInput").val().trim(),
            furcolor: $("#kittenFurcolorInput").val().trim(),
            sex: $("#kittenSexInput").val().trim()
          }
      })
      .then(function(dataKittenUser) {
          console.log("User after creation of new kitten (dataKittenUser) in user.js: ", dataKittenUser);
          // save id of current (last created) kitten
          currentKittenId = dataKittenUser.kitten[dataKittenUser.kitten.length - 1];
          console.log("currentKittenId: " + currentKittenId);
          // empty out the input fields
          $("#kittenNameInput").val("");
          $("#kittenBreedInput").val("");
          $("#kittenFurlengthInput").val("");
          $("#kittenFurcolorInput").val("");
          $("#kittenSexInput").val("");
          // Hide the current modal, then bring up 2nd modal that allows user to enter kitten metrics.
          $("#newKittenModal").modal("hide");
          $("#newKittenMetricModal").modal("show");
        });
  });


  // then, the user enters the metrics for a kitten in the modal, and submits it.
  // that reference id is stored in the kitten document
  $(document).on("click", "#submitKittenMetrics", function(event) {
    event.preventDefault();
      $.ajax({
        method: "POST",
        url: "/kittenMetrics/" + currentKittenId,
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
          // Previously, had reloaded page. Now, call function to get kitten data
          // Without interrupting the timer if it's currently running.
          //window.location.reload();
          getAllData();
        })
        .then(function() {
          console.log("insde 2nd .then after submitting new kitten metrics");
          writeKittenDom();
        });
  });

      // Now, this happens as the page loads.....
  getAllData();
      // AND, after a new kitten's metrics are entered.
      // That way, if the timer is running, a page reload happens, and interrupts
      // the timer - that won't happen.
  function getAllData() {
      // empty out the div that shows the user's current kittens and metrics
    $("#currentKittens").empty();
    // get the current user document
    // moved this out of the $.getJSON to get rid of warnings
    // supplies current user name to page.
    $("span#currentUser").text(currentUser);
    // to test a 1st time user goes to site, this line removes currentUserLoggedIn 
    // from localStorage
    // localStorage.removeItem("currentUserLoggedIn");
    // console.log("just removed currentUserLoggedIn, should be same as above: " + currentUserLoggedIn);
    currentUserLoggedIn = localStorage.getItem("currentUserLoggedIn");
    console.log("from localStorage, currentUserLoggedIn: " + currentUserLoggedIn);
    $.getJSON("/getCurrentUser" + currentUserId, function(nowCurrentUser) {
      console.log("nowCurrentUser: ", nowCurrentUser);
      console.log("nowCurrentUser[0]: ", nowCurrentUser[0]);
      console.log("nowCurrentUser[0].kitten: ", nowCurrentUser[0].kitten);
      // console.log("currentUser[0].name: ", currentUser[0].name);
      // console.log("currentUser[0].loggedIn: ", currentUser[0].loggedIn);
      // since loggedIn is always "false" in the db, it must be written over here
      // everytime the user's info is retrieved from the db
      // currentUserLoggedIn = localStorage.getItem("currentUserLoggedIn");
      // console.log("from localStorage, currentUserLoggedIn: " + currentUserLoggedIn);
      // need a timer to logout Users after a period of time.
      //
      //THIS DID NOT SEEM TO FIX IT. ASLO, WHY DID FREDDIE'S BROWER (Safari) NOT KNOW
      // PORTRAIT OR LANDSCAPE
      // test if it's the first time a user goes to site,
      // then currentUserLoggedIn would be undefined, and that user should be
      // sent back to index page instead of being allowed to stay on user page
      // Checking for null should account for 1st time user, as well as if
      // the variable just exists
      if (currentUserLoggedIn === undefined || currentUserLoggedIn === null) {
        // go back to login
        console.log("Go Back To Home! currentUserLoggedIn is undefined or null!");
        window.location.replace("/");
        return;
      } else if (currentUserLoggedIn === "true") {
        // I do save the name of the current user in local storage from the
        // login.js page. This is a good check for errors.
        console.log("!!!CHECKING: nowCurrentUser[0].name: " + nowCurrentUser[0].name +
          "   localStorage currentUser: " + currentUser);
        //$("span#currentUser").text(nowCurrentUser[0].name);
        // this .forEach goes through each kitten of the user
        // It gets the kitten document and name of kitten, then prints row of buttons
        // one for each kitten
        // currenUser[0].kitten is an array
        
        nowCurrentUser[0].kitten.forEach(outerForEach);
        
          function outerForEach(item, index) {
            //console.log("THE INDEX OF currentUser[0].kitten and value: " + index + " - " + item );
            $.getJSON("/getAKitten" + item, function(curkat) {
              // this prints the names to the DOM 
              // as a button, with that kitten's id as data-id
              $("#currentKittens").append("<button class='kittenButtons' type='submit' id='listMetrics' data-id=" +
                curkat[0]._id + ">" +
                curkat[0].name + "</button>");
            });
          }
      } else {
        // go back to login
        console.log("Go Back To Home!");
        window.location.replace("/");
        return;
      }
    });
  }
   // this function lists an individual kitten's current metrics
   // based on the id of the kitten as attached to individual buttons
  $(document).on("click", "#listMetrics", function(event) {
    event.preventDefault();
    currentKittenId = $(this).attr("data-id");
    writeKittenDom();
  });
  
  // function called after a particular kitten button is clicked - gets and displays kitten data
  function writeKittenDom() {
    console.log("currentKittenId inside writeKittendom: " + currentKittenId);
    $("#kittenMetrics").empty();
    $("#chartContainer").empty();
      // gets the array of metrics associated with the current kitten
    $.getJSON("/getAKitten" + currentKittenId, function(curkat) {
      console.log("WHAT'S IN HERE curkat[0]: ", curkat[0]);
      console.log("more specific, curkat[0].furcolor is: ", curkat[0].furcolor);
      // strings with multiple words are not being assigned.
      // try to to write the h5 element with data attributes instead.
      var showSpan = $("<span>");
      showSpan.attr("id", "editThisKitten");
      showSpan.css("color","red");
      showSpan.attr("data-name", curkat[0].name);
      showSpan.attr("data-breed", curkat[0].breed);
      showSpan.attr("data-furlength", curkat[0].furlength);
      showSpan.attr("data-furcolor", curkat[0].furcolor);
      showSpan.attr("data-sex", curkat[0].sex);
      showSpan.text("CLICK HERE");
      //this works!
      // appends the name of the current kitten and other constants
      $("#kittenMetrics").append(showSpan);
      $("#kittenMetrics").append("<p id='keepInline'> to Edit or Delete " +
      curkat[0].name + "</p><h4>Kitten: " + 
      curkat[0].name + "<br>Breed: " +
      curkat[0].breed + "<br>Fur Length: " +
      curkat[0].furlength + "<br>Fur Color: " +
      curkat[0].furcolor + "<br>Sex: " +
      curkat[0].sex +  "</h4>");
      // add the current picture of the kitten, retrieved from the database
      // This is from step 10 of adding a picture to mongodvb
      // I've already retrieved data from the chosen kitten (curkat)
      // NEED to add if statement, if no picture (after retrieving curkat), 
      //then don't print this.
      $("#kittenMetrics").append("<h1>Uploaded Images</h1>" +
        "<div><% items.forEach(function(image) { %><div>" +
        "<div><img src='data:image/<%=image.img.contentType%>;base64," +
        "<%=image.img.data.toString('base64')%>'><div>" +
        "</div></div></div><% }) %></div>");
      //
      // Add Metriccs Button - print to DOM: button with id of kitten to add metrics to kitten
      $("#kittenMetrics").append("<button type='submit' id='submitNewKittenMetrics' data-id=" + 
        curkat[0]._id + ">Add Metrics</button><br><br><h5>Click in a Metric Box to Delete or Edit</h5>");
        console.log("curkat[0].metric: ", curkat[0].metric);
        console.log("curkat[0].metric.length: " + curkat[0].metric.length);

      // this .forEach goes through each metric id to obtain associated metrics from db
      curkat[0].metric.forEach(innerForEach);

      function innerForEach(innerItem, innerIndex) {
        console.log("THIS INNER metric, innerIndex and innerItem: " + innerIndex + " and " + innerItem);
        $.getJSON("/getAMetric" + innerItem, function(curmet) {
          console.log("this innerItem or _id: " + curmet[0]._id);
          console.log("curmet[0].age: ", curmet[0].age);
          console.log("curmet[0].weight: ", curmet[0].weight);
          console.log("curmet[0].size: ", curmet[0].size);
          //create the arrays of kitten metrics
          metricIds.push(curmet[0]._id);
          kittenAges.push(curmet[0].age);
          kittenWeights.push(curmet[0].weight);
          kittenSizes.push(curmet[0].size);
          console.log("kittenAges.length = " + kittenAges.length);
          console.log("curkat[0].metric.length = " + curkat[0].metric.length);
          // only print the arrays of kitten metrics to DOM if they are completely finished
          if (kittenAges.length === curkat[0].metric.length) {
            // perform sort function to get arrays in order of kitten ages
            console.log("metricIds: " + metricIds);
            console.log("kittenAges: " + kittenAges);
            console.log("kittenWights: " + kittenWeights);
            console.log("kittenSizes: " + kittenSizes);
            // this array is emptied out here instead of after being built
            // so the user has access to it if needed to delete all the metrics
            // associated with a kitten
            sortedMetricIds = [];

            // now feed the arrays to the server side
            $.ajax({
              method: "GET",
              url: "/sortArrays/",
              data: {
                ids: metricIds,
                ages: kittenAges,
                weights: kittenWeights,
                sizes: kittenSizes
              }
            })
            .then(function(sortedMetrics) {
              console.log("from creation of sortedMetrcis: ", sortedMetrics);
              sortedMetricIds = sortedMetrics.ids;
              sortedAges = sortedMetrics.ages;
              sortedWeights = sortedMetrics.weights;
              sortedSizes = sortedMetrics.sizes;
              console.log("CHECK THIS!!!! sortedMetricIds: " + sortedMetricIds);
              console.log("sortedAges: " + sortedAges);
              console.log("sortedWights: " + sortedWeights);
              console.log("sortedSizes: " + sortedSizes);
              // call the function to print arrays to the DOM
              showDom();
            });
          }
        });
      }
      // function to print the newly created arrays to the Dom
      // the first time, these arrays are not filled yet, printing nothing to DOM
      function showDom() {
        console.log("inside function showDom, kittenAges: " + kittenAges);
        console.log("inside function showDom, sortedAges: " + sortedAges);
          for (i=0; i<kittenAges.length; i++) {
            console.log("I'm INSIDE THE showDom FORLOOP");
            $("#kittenMetrics").append("<div class='metricInfo'><h5 class='metricGroup' data_idKitten=" + 
              currentKittenId + " data_id=" + 
              sortedMetricIds[i] + " data_age=" +
              sortedAges[i] + " data_weight=" +
              sortedWeights[i] + " data_size=" +
              sortedSizes[i] + ">Age: " +
              sortedAges[i] + " Weeks" + "<br>Weight: " +
              sortedWeights[i] + " Ounces" +"<br>Length: " +
              sortedSizes[i] + " Inches" +"</h5></div>");
          }
          //
          // I think here is where the function to make the chart should be called.
          displayChart();
          //
          //empty out arrays before clicking a new kitten
          metricIds = [];
          kittenAges = [];
          kittenWeights = [];
          kittenSizes = [];
          // try: keep this array in case user wants to delete all the metrics referenced from
          // a kitten they are deleting.
          //sortedMetricIds = [];
          sortedAges = [];
          sortedWeights = [];
          sortedSizes = [];
          console.log("CHECK THIS TOO!!!! sortedMetricIds: " + sortedMetricIds);
      }
    });
  }

  // This function brings up a modal to edit currently stored kitten information, not the metrics
  // and add a delete button 
  $(document).on("click", "#editThisKitten", function(event) {
    event.preventDefault();
    console.log("Inside edit this kitten function.");
    // retrieve data about "this" kitten from user clicking HERE
    thisName = $(this).attr("data-name");
    thisBreed = $(this).attr("data-breed");
    thisFurlength = $(this).attr("data-furlength");
    thisFurcolor = $(this).attr("data-furcolor");
    thisSex = $(this).attr("data-sex");
    console.log("thisName: " + thisName);
    $("#editKittenModal").modal("show");
    // fill the form with data currently in db. 
    $("#editKittenNameInput").val(thisName);
    $("#editKittenBreedInput").val(thisBreed);
    $("#editKittenFurlengthInput").val(thisFurlength);
    $("#editKittenFurcolorInput").val(thisFurcolor);
    $("#editKittenSexInput").val(thisSex);
    // the modal comes up with the info correct, 
  });
    
    //now, retrieve the info (.val()) the user puts in modal to edit the kitten,
    // and submit it to the db using .set
    $(document).on("click", "#submitEditKitten", function(event) {
      event.preventDefault();
      console.log("inside submitEditKitten");
      $.ajax({
        method: "POST",
        url: "/editKitten/" + currentKittenId,
        data: {
          name: $("#editKittenNameInput").val().trim(),
          breed: $("#editKittenBreedInput").val().trim(),
          furlength:$("#editKittenFurlengthInput").val().trim(),
          furcolor: $("#editKittenFurcolorInput").val().trim(),
          sex: $("#editKittenSexInput").val().trim()
        }
      })
      .then(function(editedKittendb) {
          console.log("User after kitten metrics (allDataKittenUser) in user.js: ", editedKittendb);
          // empty out the input fields
          $("#editKittenNameInput").val("");
          $("#editKittenBreedInput").val("");
          $("#editKittenFurlengthInput").val("");
          $("#editKittenFurcolorInput").val("");
          $("#editKittenSexInput").val("");
          // then hide this modal
          $("#editKittenModal").modal("hide");
          //reload the kitten div showing the changes
          writeKittenDom();
        });
    });

    // This function processis the image of the kitten chosen by the user
    // From tutorial on taking a form in html, and ajax call here with multiform
    $(document).on("click", "#submitNewKittenImage", function(event) {
      event.preventDefault();
      console.log("inside submitNewKittenImage!");
      //get form from html
      var imageform = $("#kittenImageInputForm")[0];
      // Create an FormData object called imageData
      var imageData = new FormData(imageform);
      // testing extra field for the FormData
      //imageData.append("CustomField", "This is some extra data, testing");
      // disable the form's submit button
      $("#submitNewKittenImage").prop("disabled", true);
      $.ajax({
        type: "POST",
        enctype: "multipart/form-data",
        url: "/createImageKitten/" + currentKittenId,
        data: imageData,
        processData: false,
        contentType: false
      })
      .then(function(imagedb) {
          console.log("after .then for submitting an image, imagedb: ", imagedb);
          // what do I do with imagedb? 
          // then hide this modal
          $("#newKittenImageModal").modal("hide");
          //reload the kitten div showing the changes
          //writeKittenDom();
        });
    });

    // pull up the modal to ask user if they're sure they want to delete the kitten
  $(document).on("click", "#deleteKitten", function(event) {
    event.preventDefault();
    $("#editKittenModal").modal("hide");
    $("#deleteForSure").modal("show");
  });

    // And delete that kitten
  $(document).on("click", "#deleteKittenYes", function(event) {
    event.preventDefault();
    $("#deleteForSure").modal("hide");
    console.log("I just clicked yes to delete the kitten");
    console.log("currentUserId: " + currentUserId);
    console.log("currentKittenId: " + currentKittenId);
    console.log("CHECK THIS LASTLY!!!! sortedMetricIds: " + sortedMetricIds);
    //  - what happens to the metric data referenced
    // to THAT kitten??? It doesn NOT go away. Need to find those metric id's
    // and delete them then delete the kitten, then delete the ref to that kitten in
    // the user collection (or document?)
    // So, we KNOW the currentKittenId
    // what does that give us?  We have sortedMetricIds - the array of metric refs for this chosen kitten

    // DELETE this specific kitten from the user collection
    $.ajax({
      method: "DELETE",
      url: "/kitten/delete/" + currentKittenId
    })
      .then (function(dbKitten) { 
        console.log("dbKitten after delete: ", dbKitten); // shows a successful delete of 1 document
        // and then delete (or "pull") the reference to that just deleted document from the user document
        $.ajax({
          method: "POST",
          url: "/user/removeRef/" + currentUserId,
          data: {kittenId: currentKittenId}
        })
          .then (function(dbUser) {
            console.log("dbUser after POST/user/removeRef/id: ", dbUser);
            // now delete the metrics referenced from the kitten collection
            for (i=0; i<sortedMetricIds.length; i++) {
              $.ajax({
                method: "DELETE",
                url: "/metrics/delete/" + sortedMetricIds[i]
              })
              .then (function(dbMetric) {
                console.log("and counter: " + i + "is index to which metric data after deleting a kitten, dbMetric: ", dbMetric);
              });
            }
            // redraw page to show current kittens of current user
            getAllData();
            $("#kittenMetrics").empty();
          });
      });
  });
  

   // This function is used as user clicks on the Add Metrics button (rendered from above)
  // to add metrics to an existing kitten, also while other metrics have been listed
  $(document).on("click", "#submitNewKittenMetrics", function(event) {
    event.preventDefault();
    $("#newKittenMetricModal").modal("show");
    currentKittenId = $(this).attr("data-id");
  });
 
 //  user clicks anywhere on document inside of nav and footer
  $(document).on("click", ".wrapper", function(event) {
    // this event.preventDefault() is commented out because I have an input field, 
    // type=file that wasn't bringing up the choose file browser window.
    // Dont know if this is a problem. Maybe check if there are other click events while using
    // this portion of code.
    //event.preventDefault();  
    console.log("user has clicked on the wrapper!");
    console.log("littleButton is: " + littleButton);
    if (littleButton === true) { // the edit and delete buttons should be removed if clicked
      // anywhere but themselves
      //console.log("Check to see if littleButton is true: " + littleButton);
      if ($(event.target).hasClass("littleX") || $(event.target).hasClass("littleE")) {
          // then user has clicked on one of the buttons,
          // and seperate functions will be called.
          //console.log("User has clicked on a delete or edit buton!");
      } else { // user clicked somewhere other than the delete or edit button
        //console.log("delete and edit buttons already exist, but were not chosen.");
        removeButtons();
      }
    } else { // needs to ask if the click event was on .metricGroup
      //console.log("littlebutton should be false: " + littleButton);
          //  No little buttons, user must click on the metricGroup div
          // If metricInfo is clicked, no different than if user had clicked elsewhere
          // in wrapper
      if ($(event.target).hasClass("metricInfo")) {
        //console.log("user clicked in metricInfo");
      } else if ($(event.target).hasClass("metricGroup")) {
        //console.log("user clicked in metricGroup");
        // .parent method adds the buttons to the metric Info div, even though
        // the group of metrics was clicked.
        target = $(event.target).parent();
        // First, the id associated with these metrics, and the id of the kitten
        thisId = $(event.target).attr("data_id");
        thisKittenId = $(event.target).attr("data_idKitten");
        thisAge = $(event.target).attr("data_age");
        thisWeight = $(event.target).attr("data_weight");
        thisSize = $(event.target).attr("data_size");
        console.log("AFTER clicked .metricGroup, thisID: "  + thisId + " and thisKittenId: " + thisKittenId);
        addButtons();
      } else { // user has clicked elsewhere than the metric info div
        console.log("the current target (click) is NOT the .metricGroup");
        // user has clicked somewhere on page but not on .metricInfo
        // don't do anything. (maybe here add if other classes are clicked??)
      }
    }
  });

  // This function addes the thick border and the delete and edit buttons to 
  // a clicked .metricGroup div. 
  function addButtons() {
    target.css({
      'border-width': '5px'
    });
    console.log("INSIDE addButtons, thisID: "  + thisId + " and thisKittenId: " + thisKittenId);
    // append the delete and edit buttons, with data of metric document id, and kitten document id
    target.append("<button type='button' class='btn btn-default btn-xs littleX' data_idKitten=" + 
    thisKittenId + " data_id=" + 
    thisId + "><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></button>");
    target.append("<button type='button' class='btn btn-default btn-xs littleE' data_idKitten=" + 
    thisKittenId + " data_id=" + 
    thisId + "><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button>");
      // set boolean to true that delete and edit buttons exist
    littleButton = true;
  }

  // This function removes the delete and edit buttons if they already exist. 
    function removeButtons() {
    $(".metricInfo").css({
        'border-width': '1px'
      });
    $(".littleX").remove();
    $(".littleE").remove();
    littleButton = false;
  }

  // Function to delete one set of metric info of a kitten, selected by user
  $(document).on("click", ".littleX", function(event) {
    event.preventDefault();
    console.log("Inside DELETE set of metric info!");
    removeButtons();
    // delete this group of metric info from the db,
    // First, the id associated with these metrics, and the id of the kitten
    thisId = $(this).attr("data_id");
    thisKittenId = $(this).attr("data_idKitten");
    console.log("AFTER clicking littleX, thisID: "  + thisId + " and thisKittenId: " + thisKittenId);
    // DELETE these specific metrics from the metrics collection
    $.ajax({
      method: "DELETE",
      url: "/metrics/delete/" + thisId
    })
      .then (function(dbMetric) { 
        console.log("dbMetric after delete: ", dbMetric); // shows a successful delete of 1 document
        // and then delete (or "pull") the reference to that just deleted document from the kitten document
        $.ajax({
          method: "POST",
          url: "/kittens/removeRef/" + thisKittenId,
          data: {metricId: thisId}
        })
        .then (function(dbKitten) {
          console.log("dbKitten after POST/kittens/removeRef/id: ", dbKitten);
          // still need to reload the metrics div
          writeKittenDom();
        });
      });
  });
  
  // Function to edit one set of metric info of a kitten, selected by user
  $(document).on("click", ".littleE", function(event) {
    event.preventDefault();
    console.log("Inside EDIT set of metric info!");
    $(".metricInfo").css({
      'border-width': '1px'
    });
    $(".littleX").remove();
    $(".littleE").remove();
    littleButton = false;
    // bring up modal to edit existing information for this group of kitten metrics
    // check if all the variables are correctly defined
    console.log("AFTER clicking littleE," +
    " thisID: "  + thisId + 
    " thisKittenId: " + thisKittenId +
    " thisAge:" + thisAge +
    " thisWeight:" + thisWeight +
    " thisSize:" + thisSize);
    $("#editKittenMetricModal").modal("show");
    $("#newKittenAgeInput").val(thisAge);
    $("#newKittenWeightInput").val(thisWeight);
    $("#newKittenSizeInput").val(thisSize);
  });

  $(document).on("click", "#submitEditedKittenMetrics", function(event) {
    event.preventDefault();
    console.log("inside submitEditedKittenMetrics");
    $.ajax({
      method: "POST",
      url: "/editMetrics/" + thisId,
      data: {
          age: $("#newKittenAgeInput").val().trim(),
          weight: $("#newKittenWeightInput").val().trim(),
          size: $("#newKittenSizeInput").val().trim()
      }
    })
    .then(function(editedMetricdb) {
        console.log("User after kitten metrics (allDataKittenUser) in user.js: ", editedMetricdb);
        // empty out the input fields
        $("#newKittenAgeInput").val("");
        $("#newKittenWeightInput").val("");
        $("#newKittenSizeInput").val("");
        // then hide this modal
        $("#editKittenMetricModal").modal("hide");
        //reload the metric div showing the changes
        writeKittenDom();
      });
  });
});
 // This is the function for creating the line chart of the kitten metric data. Each chart will have 
  // the age of the kitten for the x-axis, and size and weight will be separate line charts
  // that the user can toggle between. 
  // Only the chosen kitten's data will be displayed on the chart below (above?) the kitten's
  // metric boxes.
  function displayChart() {
    // below, dataPoints is an array of objects. I'm not joining 2 arrays
    // so  {x:sortedAges, y:sortedSizes} and then pushed into an array
    // sortedAges is one array, sortedSizes is another
    // create and empty out arrays and objects just for this function - don't forget to empty 
    // the div on the page.
    // are these integers or floats?
    var sortedAgesNumb = [];
    var sortedSizesNumb = [];
    var sortedWeightsNumb = [];
    var resultObjectSize = {};
    var resultObjectWeight = {};
    dataPointsArraySize = [];
    dataPointsArrayWeight = [];
    jQuery("#chartContainerBoth").css({
      "height" : "300px", 
      "width" : "100%"
    });
    jQuery("#chartContainerSize").css({
      "height" : "300px", 
      "width" : "100%"
    });
    jQuery("#chartContainerWeight").css({
      "height" : "300px", 
      "width" : "100%"
    });
    // need to convert the arrays of strings to arrays of numbers
    console.log("before convert, sortedAges: ", sortedAges);
    var sortedAgesNumb = sortedAges.map(Number);
    var sortedSizesNumb = sortedSizes.map(Number);
    var sortedWeightsNumb = sortedWeights.map(Number);
    console.log("after convert, sortedAges: ", sortedAgesNumb);
    
    for (i=0; i<sortedAgesNumb.length; i++) {
      resultObjectSize={ x : sortedAgesNumb[i] , y : sortedSizesNumb[i]};
      resultObjectWeight={ x : sortedAgesNumb[i] , y : sortedWeightsNumb[i]};
      console.log("resultObjectSize: ", resultObjectSize);
      console.log("resultObjectWeight: ", resultObjectWeight);
      dataPointsArraySize.push(resultObjectSize);
      dataPointsArrayWeight.push(resultObjectWeight);
    }
    console.log("HERE! the new dataPointsArraySize: ", dataPointsArraySize);
    console.log("HERE! the new dataPointsArrayWeight: ", dataPointsArrayWeight);
    
    // Putting both charts together has been commented out for clarity
    // var chartOptionsBoth = {
    //   animationEnabled: true,
    //   theme: "light2",
    //   title:{
    //     text: "Kitten Size and Weight"
    //   },
    //   axisX:{
    //     title: "Age in Weeks"
    //   },
    //   axisY: {
    //     title: "Kitten Size(in.) and Weight(oz.)",
    //     minimum: 0
    //   },
    //   toolTip:{
    //     shared:true
    //   },  
    //   legend:{
    //     cursor:"pointer",
    //     verticalAlign: "bottom",
    //     horizontalAlign: "left",
    //     dockInsidePlotArea: true,
    //     itemclick: toogleDataSeries
    //   },
    //   data: [{
    //     type: "line",
    //     showInLegend: true,
    //     name: "Kitten Size",
    //     markerType: "square",
    //     color: "#F08080",
    //     dataPoints: dataPointsArraySize
    //   },
    //   {
    //     type: "line",
    //     showInLegend: true,
    //     name: "Kitten Weight",
    //     lineDashType: "dash",
    //     //yValueFormatString: "#,##0K",
    //     dataPoints: dataPointsArrayWeight
    //   }]
    // };
    // $("#chartContainerBoth").CanvasJSChart(chartOptionsBoth);
    
    // function toogleDataSeries(e){
    //   if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
    //     e.dataSeries.visible = false;
    //   } else{
    //     e.dataSeries.visible = true;
    //   }
    //   e.chart.render();
    // }

    // Make a chart with just the kitten size
    var chartOptionsSize = {
      animationEnabled: true,
      theme: "light2",
      title:{
        text: "Kitten Size"
      },
      axisX:{
        title: "Age in Weeks"
      },
      axisY: {
        title: "Kitten Size(in.)",
        minimum: 0
      },
      toolTip:{
        shared:true
      },  
      data: [{
        type: "line",
        showInLegend: true,
        name: "Kitten Size",
        markerType: "square",
        color: "#F08080",
        dataPoints: dataPointsArraySize
      }]
    };
    $("#chartContainerSize").CanvasJSChart(chartOptionsSize);
    //  End of code for just kitten size

    // Make a chart with just the kitten weight
    var chartOptionsWeight = {
      animationEnabled: true,
      theme: "light2",
      title:{
        text: "Kitten Weight"
      },
      axisX:{
        title: "Age in Weeks"
      },
      axisY: {
        title: "Kitten Weight(oz.)",
        minimum: 0
      },
      toolTip:{
        shared:true
      },  
      data: [{
        type: "line",
        showInLegend: true,
        name: "Kitten Weight",
        markerType: "square",
        color: "#F08080",
        dataPoints: dataPointsArrayWeight
      }]
    };
    $("#chartContainerWeight").CanvasJSChart(chartOptionsWeight);
    // End of code for just kitten weight
  }  // end of function displayChart()