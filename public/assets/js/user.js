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
var currentImageId = "";
var kittenIds = [];
var kittenNames = [];
var kittenBreeds = [];
var kittenFurlengths = [];
var kittenFurcolors = [];
var kittenSexes = [];
var metricIds = [];
var kittenAges = [];
var kittenWeights = [];
var kittenWeightUnits = [];
var kittenSizes = [];
var kittenSizeUnits = [];
// these are needed across functions as they are sorted in one, and printed to DOM

var sortedMetricIds = [];
var sortedAges = [];
var sortedWeights = [];
var sortedWeightUnits = [];
var sortedSizes = [];
var sortedSizeUnits = [];

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
var thisWeightUnit;
var selText = "ounces";
var thisSize;
var thisSizeUnit;
var selTextSize = "inches";
var dataPointsArraySize = [];
var dataPointsArrayWeight = [];
var thisTitleId;
jQuery.noConflict();
jQuery(document).ready(function( $ ){
  jQuery(document).ready(function( $ ){ feedKittenTimer(); });
  //console.log(hello from user.js");
  //console.log(from user.js, currentUserId is ", currentUserId);
  //console.log(from user.js, currentUserLoggedIn is ", currentUserLoggedIn);
  // This code is used if a user returns from the topics page,
  // or another page, and there is a feed kitten timer currently going off.
  // it acts as the same code in topic.js.
  startCount = parseInt(localStorage.getItem("startCount"));
  //console.log(in user.js, getItem startCount: " + startCount);
  myTimer = parseInt(localStorage.getItem("myTimer"));
  // If a timer is running, bypass the click event to start timer function
  if (startCount > 0) {
    //console.log(in user.js, testing if startCount > 0, startCount: " + startCount);
    clickFunction();
  } else {
    //console.log(startCount is NOT greater than 0");
  }


  // insert a logout function
  $(document).on("click", "#logoutButton", function(event) {
    event.preventDefault();
    //console.log(This is the logout function!");
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
      //console.log(userUpdate: ", userUpdate);
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
        //console.log(in user.js, dataCreateKitten, after User is populated: ", dataCreateKitten);
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
          //console.log(User after creation of new kitten (dataKittenUser) in user.js: ", dataKittenUser);
          // save id of current (last created) kitten
          currentKittenId = dataKittenUser.kitten[dataKittenUser.kitten.length - 1];
          //console.log(currentKittenId: " + currentKittenId);
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
    console.log("from user choosing weight units, selText: ", selText);
    console.log("from user choosing size units, selTextSize: ", selTextSize);
      $.ajax({
        method: "POST",
        url: "/kittenMetrics/" + currentKittenId,
        data: {
            age: $("#kittenAgeInput").val().trim(),
            weight: $("#kittenWeightInput").val().trim(),
            // the chosen units of the weight saved here
            weightunit: selText,
            size: $("#kittenSizeInput").val().trim(),
            sizeunit: selTextSize
        }
      })
      .then(function(allDataKittenUser) {
          //console.log(User after kitten metrics (allDataKittenUser) in user.js: ", allDataKittenUser);
          // empty out the input fields
          $("#kittenAgeInput").val("");
          $("#kittenWeightInput").val("");
          //
          // the unit button stays on whatever the last choice is
          $("#kittenSizeInput").val("");
          // then hide this modal
          $("#newKittenMetricModal").modal("hide");
          // Previously, had reloaded page. Now, call function to get kitten data
          // Without interrupting the timer if it's currently running.
          //window.location.reload();
          getAllData();
        })
        .then(function() {
          //console.log(insde 2nd .then after submitting new kitten metrics");
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
      // console.log("nowCurrentUser: ", nowCurrentUser);
      // console.log("nowCurrentUser[0]: ", nowCurrentUser[0]);
      // console.log("nowCurrentUser[0].kitten: ", nowCurrentUser[0].kitten);
      // console.log("currentUser[0].name: ", currentUser[0].name);
      // console.log("currentUser[0].loggedIn: ", currentUser[0].loggedIn);
      // since loggedIn is always "false" in the db, it must be written over here
      // everytime the user's info is retrieved from the db
      // currentUserLoggedIn = localStorage.getItem("currentUserLoggedIn");
      // console.log("from localStorage, currentUserLoggedIn: " + currentUserLoggedIn);
      // need a timer to logout Users after a period of time.
      //
      //THIS DID NOT SEEM TO FIX IT. ASLO, WHY DID FREDDIE'S BROWSER (Safari) NOT KNOW
      // PORTRAIT OR LANDSCAPE
      // test if it's the first time a user goes to site,
      // then currentUserLoggedIn would be undefined, and that user should be
      // sent back to index page instead of being allowed to stay on user page
      // Checking for null should account for 1st time user, as well as if
      // the variable just exists
      if (currentUserLoggedIn === undefined || currentUserLoggedIn === null) {
        // go back to login
        //console.log(Go Back To Home! currentUserLoggedIn is undefined or null!");
        window.location.replace("/");
        return;
      } else if (currentUserLoggedIn === "true") {
        // I do save the name of the current user in local storage from the
        // login.js page. This is a good check for errors.
        // console.log(!!!CHECKING: nowCurrentUser[0].name: " + nowCurrentUser[0].name +
        //   "   localStorage currentUser: " + currentUser);
        //$("span#currentUser").text(nowCurrentUser[0].name);
        // this .forEach goes through each kitten of the user
        // It gets the kitten document and name of kitten, then prints row of buttons
        // one for each kitten
        // currenUser[0].kitten is an array
        
        nowCurrentUser[0].kitten.forEach(outerForEach);
        
          function outerForEach(item, index) {
            //console.log("THE INDEX OF currentUser[0].kitten and value: " + index + " - " + item );
            $.getJSON("/getAKitten/" + item, function(curkat) {
              // this prints the names to the DOM 
              // as a button, with that kitten's id as data-id
              $("#currentKittens").append("<button class='kittenButtons' type='submit' id='listMetrics' data-id=" +
                curkat[0]._id + ">" +
                curkat[0].name + "</button>");
            });
          }
      } else {
        // go back to login
        //console.log(Go Back To Home!");
        window.location.replace("/");
        return;
      }
    });
  }

   // this function lists an individual kitten's current metrics and images
   // based on the id of the kitten as attached to individual buttons
  $(document).on("click", "#listMetrics", function(event) {
    event.preventDefault();
    currentKittenId = $(this).attr("data-id");
    writeKittenDom();
  });
  
  // function called after a particular kitten button is clicked - gets and displays kitten data
  function writeKittenDom() {
    //console.log(currentKittenId inside writeKittendom: " + currentKittenId);
    $("#kittenMetrics").empty(); // empties out the div containing image and metric data of chosen kitten
    $("#chartContainer").empty();
      // gets the array of metrics associated with the current kitten
    $.getJSON("/getAKitten/" + currentKittenId, function(curkat) {
      //console.log(WHAT'S IN HERE curkat[0]: ", curkat[0]);
      //console.log(more specific, curkat[0].furcolor is: ", curkat[0].furcolor);
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
      showSpan.text("HERE");
      //this works!
      // appends the name of the current kitten and other constants
      $("#kittenMetrics").append("<p class='keepInline'>(CLICK</p>");
      $("#kittenMetrics").append(showSpan);
      $("#kittenMetrics").append("<p class='keepInline'> to Edit or Delete " +
      curkat[0].name + ")</p><h4>Kitten: " + 
      curkat[0].name + "<br>Breed: " +
      curkat[0].breed + "<br>Fur Length: " +
      curkat[0].furlength + "<br>Fur Color: " +
      curkat[0].furcolor + "<br>Sex: " +
      curkat[0].sex +  "</h4>");
      //
      // Add new images Button - to add a picture of the kitten
      $("#kittenMetrics").append("<button type='button' data-toggle='modal' " +
      "data-target='#newKittenImageModal' id='createImageKitten'" + 
      ">Add Image for Kitten</button>");
      // So HERE is where the div of the current kitten's images will go.
      $("#kittenMetrics").append("<div id='imageDiv'></div>");
      //go through the array of images for this kitten
      curkat[0].image.forEach(innerImageForEach);

      function innerImageForEach(innerItem, innerIndex) { //innerItem here is metric id of images
        //console.log(THIS INNER image, innerIndex and innerItem: " + innerIndex + " and " + innerItem);
        $.ajax({
          method: "GET",
          url: "/getImages/" + innerItem
        })
          .then(function(dataGetImages) { // dataGetImages should be formattedImages from api-routes.js
            // this is the current image data
            //console.log(in user.js, after each get images dataGetImages: ", dataGetImages);
            // then dataGetImages should be something I can setnd to user.html through jQuery
            $("#imageDiv").append(dataGetImages);
            // does user still have currentKittenId?
            //console.log(currentKittenId: " + currentKittenId);
          });
      }
      // Add Metrics Button - print to DOM: button with id of kitten to add metrics to kitten
      $("#kittenMetrics").append("<button type='submit' id='submitNewKittenMetrics' data-id=" + 
        curkat[0]._id + ">Add Metrics</button><h5>Click in a Metric Box to Delete or Edit</h5>");
        //console.log(curkat[0].metric: ", curkat[0].metric);
        //console.log(curkat[0].metric.length: " + curkat[0].metric.length);

      // this .forEach goes through each metric id to obtain associated metrics from db
      curkat[0].metric.forEach(innerMetricForEach);

      function innerMetricForEach(innerItem, innerIndex) {
        //console.log(THIS INNER metric, innerIndex and innerItem: " + innerIndex + " and " + innerItem);
        $.getJSON("/getAMetric/" + innerItem, function(curmet) {
          //console.log("this innerItem or _id: " + curmet[0]._id);
          //console.log("curmet[0].age: ", curmet[0].age);
          //console.log("curmet[0].weight: ", curmet[0].weight);
          console.log("curmet[0].weightunit: ", curmet[0].weightunit);
          console.log("curmet[0].sizeunit: ", curmet[0].sizeunit);
          if (curmet[0].weightunit === undefined) {
            curmet[0].weightunit = "ounces";
          }
          if (curmet[0].sizeunit === undefined) {
            curmet[0].sizeunit = "inches";
          }
          // change old entries of units to lower case
          curmet[0].weightunit = curmet[0].weightunit.toLowerCase();
          console.log("after to lower case, curmet[0].weightunit: ", curmet[0].weightunit);
          curmet[0].sizeunit = curmet[0].sizeunit.toLowerCase();
          console.log("after to lower case, curmet[0].sizetunit: ", curmet[0].sizeunit);
          //console.log("curmet[0].size: ", curmet[0].size);
          //create the arrays of kitten metrics
          metricIds.push(curmet[0]._id);
          kittenAges.push(curmet[0].age);
          kittenWeights.push(curmet[0].weight);
          kittenWeightUnits.push(curmet[0].weightunit);
          console.log("user.js: kittenWeightUnits: ", kittenWeightUnits);
          kittenSizes.push(curmet[0].size);
          kittenSizeUnits.push(curmet[0].sizeunit);
          //console.log(kittenAges.length = " + kittenAges.length);
          //console.log(curkat[0].metric.length = " + curkat[0].metric.length);
          // only print the arrays of kitten metrics to DOM if they are completely finished
          if (kittenAges.length === curkat[0].metric.length) {
            // perform sort function to get arrays in order of kitten ages
            //console.log(metricIds: " + metricIds);
            //console.log(kittenAges: " + kittenAges);
            //console.log(kittenWights: " + kittenWeights);
            //console.log(kittenSizes: " + kittenSizes);
            // this array is emptied out here instead of after being built
            // so the user has access to it if needed to delete all the metrics
            // associated with a kitten
            sortedMetricIds = [];

            // now feed the arrays to the server side to sort them according to age
            $.ajax({
              method: "GET",
              url: "/sortArrays/",
              data: {
                ids: metricIds,
                ages: kittenAges,
                weights: kittenWeights,
                weightunits: kittenWeightUnits,
                sizes: kittenSizes,
                sizeunits: kittenSizeUnits
              }
            })
            .then(function(sortedMetrics) {
              //console.log(from creation of sortedMetrcis: ", sortedMetrics);
              sortedMetricIds = sortedMetrics.ids;
              sortedAges = sortedMetrics.ages;
              sortedWeights = sortedMetrics.weights;
              sortedWeightUnits = sortedMetrics.weightunits;
              console.log("sortedWeightUnits: ", sortedWeightUnits);
              sortedSizes = sortedMetrics.sizes;
              sortedSizeUnits = sortedMetrics.sizeunits;
              console.log("sortedSizeUnits: ", sortedSizeUnits);

              // console.log("CHECK THIS!!!! sortedMetricIds: " + sortedMetricIds);
               console.log("sortedAges: " + sortedAges);
              // console.log("sortedWights: " + sortedWeights);
              // console.log("sortedSizes: " + sortedSizes);
              // call the function to print arrays to the DOM
              showDom();
            });
          }
        });
      }
      // function to print the newly created arrays to the Dom
      // the first time, these arrays are not filled yet, printing nothing to DOM
      function showDom() {
        //console.log(inside function showDom, kittenAges: " + kittenAges);
        //console.log(inside function showDom, sortedAges: " + sortedAges);
          for (i=0; i<kittenAges.length; i++) {
            //console.log(I'm INSIDE THE showDom FORLOOP");
            $("#kittenMetrics").append("<div class='metricInfo'><h5 class='metricGroup' data_idKitten=" + 
              currentKittenId + " data_id=" + 
              sortedMetricIds[i] + " data_age=" +
              sortedAges[i] + " data_weight=" +
              sortedWeights[i] + " data_weightunit=" +
              sortedWeightUnits[i] + " data_size=" +
              sortedSizes[i] + " data_sizeunit=" +
              sortedSizeUnits[i] +  ">age: " +
              sortedAges[i] + " weeks" + "<br>Weight: " +
              sortedWeights[i] + " " + sortedWeightUnits[i] + "<br>Length: " +
              sortedSizes[i] + " " + sortedSizeUnits[i] + "</h5></div>");
          }
          //
          // I think here is where the function to make the chart should be called.
          displayChart();
          //
          //empty out arrays before clicking a new kitten
          metricIds = [];
          kittenAges = [];
          kittenWeights = [];
          kittenWeightUnits = [];
          kittenSizes = [];
          kittenSizeUnits = [];
          // try: keep this array in case user wants to delete all the metrics referenced from
          // a kitten they are deleting.
          //sortedMetricIds = [];
          sortedAges = [];
          sortedWeights = [];
          sortedWeightUnits = [];
          sortedSizes = [];
          sortedSizeUnits = [];
          //console.log("CHECK THIS TOO!!!! sortedMetricIds: " + sortedMetricIds);
      }
    });
  }

  // This click function pulls up a large modal of the clicked image
  //  It takes its data from the src of the image without getting the data again from
  // the db.
  $(document).on("click", ".theImages", function(event) {
    event.preventDefault();
    //delete previous contents of image div.
    $("#bigImageDiv").empty();
    $("#kittenImageTitle").text("");
    $("#kittenImageDesc").text("");
    //console.log(Inside click event of the image");
    // create a variable that contains the info to build the image for display
    var imgSrc = $(this).attr("src");
    var bigImage = $("<img>");
    // need to add a class so that the image can be sized to different screens
    bigImage.addClass("bigImageinModal");
    bigImage.attr("src", imgSrc);
    // retrieve Title and Desc of this image.
    var thisId = $(this).attr("data-id");
    // store the id of the image for delete function to work
    currentImageId = thisId;
    // user should have the id of the current kitten
    // need this to delete this particular image from inside modal
    // and delete the reference to the image in the kitten document in the db
    //console.log(currentKittenId: " + currentKittenId);
    //console.log(thisId from get image title: " + thisId);
    $.getJSON("/getImageTitleDesc/" + thisId, function(currentImage) {
      //console.log(currentImage: ", currentImage);
      //console.log(currentImage[0].title: ", currentImage[0].title);
      //console.log(currentImage[0].desc: ", currentImage[0].desc);
      //create variables to contains the info to build the title and description for display
      var imgTitle = $("<h2>");
      imgTitle.addClass("editKittenImageTitle");
      imgTitle.attr("data-id", currentImage[0]._id);
      imgTitle.text(currentImage[0].title);
      var imgDesc = $("<h5>");
      imgDesc.addClass("editKittenImageDesc");
      imgDesc.attr("data-id", currentImage[0]._id);
      imgDesc.text(currentImage[0].desc);
      // append the newly created variables to the correct divs in HTML MOD
      $("#bigImageDiv").append(bigImage);
      $("#kittenImageTitle").append(imgTitle);
      $("#kittenImageTitle").append("<p class='directions'>(Click text to edit)</p>");
      $("#kittenImageDesc").append(imgDesc);
      $("#kittenImageDesc").append("<p class='directions'>(Click text to edit)</p>");
      //show modal with image, name, and desc.
      $("#bigImageModal").modal("show");
    });
  });

  // This function shows the form for a user to edit the Title
  // for a kitten's large image displayed in the modal.
  $(document).on("click", ".editKittenImageTitle", function(event) {
    event.preventDefault();
    var thisTitle = $(this).text();
    //console.log(thisTitle: " + thisTitle);
    thisTitleId = $(this).attr("data-id");
    // show the div to edit the current title
    $("#bigImageEditTitle").append("<div class='form-group'>" +
      "<label for='editTitle'>New Title of Image</label>" +
      "<input type='text' id='editTitle' name='editTitle'>" +
      "</div>" +
      "<button type='submit' id='submitEditedImageTitle'>Submit</button><br>");
      $("#editTitle").val(thisTitle);
  });

  //After user clicks Submit, this function changes the title 
  // kitten's large image in the db
  $(document).on("click", "#submitEditedImageTitle", function(event) {
    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/editImageTitle/" + thisTitleId,
      data: {
        title: $("#editTitle").val().trim()
      }
    })
    .then(function(editedImagedb) {
        //console.log("Imagedb after title edit (editedImagedb) in user.js: ", editedImagedb);
        // empty out the input fields
        $("#editTitle").val("");
        // then hide the div to edit and this modal
        $("#bigImageEditTitle").empty();
        $("#bigImageModal").modal("hide");
      });
  });

  // This function shows the form for a user to edit the Description
  // for a kitten's large image displayed in the modal.
  $(document).on("click", ".editKittenImageDesc", function(event) {
    event.preventDefault();
    var thisDesc = $(this).text();
    //console.log(thisDesc: " + thisDesc);
    thisDescId = $(this).attr("data-id");
    // show the div to edit the current title
    $("#bigImageEditDesc").append("<div class='form-group'>" +
      "<label for='editDesc'>New Description of Image</label>" +
      "<input type='text' id='editDesc' name='editDesc'>" +
      "</div>" +
      "<button type='submit' id='submitEditedImageDesc'>Submit</button><br>");
      $("#editDesc").val(thisDesc);
  });

  //After user clicks Submit, this function changes the title 
  // kitten's large image in the db
  $(document).on("click", "#submitEditedImageDesc", function(event) {
    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/editImageDesc/" + thisDescId,
      data: {
        desc: $("#editDesc").val().trim()
      }
    })
    .then(function(editedImagedb) {
        //console.log("Imagedb after desc edit (editedImagedb) in user.js: ", editedImagedb);
        // empty out the input fields
        $("#editDesc").val("");
        // then hide the div to edit and this modal
        $("#bigImageEditDesc").empty();
        $("#bigImageModal").modal("hide");
      });
  });

  // This function brings up a modal to edit currently stored kitten information, not the metrics
  // and add a delete button 
  $(document).on("click", "#editThisKitten", function(event) {
    event.preventDefault();
    //console.log("Inside edit this kitten function.");
    // retrieve data about "this" kitten from user clicking HERE
    thisName = $(this).attr("data-name");
    thisBreed = $(this).attr("data-breed");
    thisFurlength = $(this).attr("data-furlength");
    thisFurcolor = $(this).attr("data-furcolor");
    thisSex = $(this).attr("data-sex");
    //console.log("thisName: " + thisName);
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
      //console.log("inside submitEditKitten");
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
          //console.log("User after kitten metrics (allDataKittenUser) in user.js: ", editedKittendb);
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

    // This function processes the image of the kitten chosen by the user
    // From tutorial on taking a form in html, and ajax call here with multiform
    $(document).on("click", "#submitNewKittenImage", function(event) {
      event.preventDefault();
      //console.log("inside submitNewKittenImage!");
      //get form from html
      var imageform = $("#kittenImageInputForm")[0];
      //console.log("what is imageform?: ", imageform);
      // Create an FormData object called imageData
      var imageData = new FormData(imageform);
      //console.log("what is imageData?: ", imageData);
      $.ajax({
        type: "POST",
        enctype: "multipart/form-data",
        url: "/createImageKitten/" + currentKittenId,
        data: imageData,
        processData: false,
        contentType: false
      })
      .then(function(kittendb) {
          //console.log("after .then for submitting an image, imagedb: ", kittendb);
          // kittendb here is the kitten document with the new image data
          // then hide this modal
          $("#title").val("");
          $("#desc").val("");
          $("#kittenImageInput").val("");
          $("#newKittenImageModal").modal("hide");
          //reload the kitten div showing the changes
          $("#imageDiv").empty();
          writeKittenDom();
        });
    });

      // Function to delete one image of a kitten, selected by user
  $(document).on("click", "#deleteImage", function(event) {
    event.preventDefault();
    // delete this image from the db,
    // The id associated with this image, and the id of the kitten, are both known
    //console.log("currentImageId: "  + currentImageId + " and currentKittenId: " + currentKittenId);
    // DELETE these specific metrics from the metrics collection
    $.ajax({
      method: "DELETE",
      url: "/image/delete/" + currentImageId
    })
      .then (function(dbImage) { 
        //console.log("dbImage after delete: ", dbImage); // shows a successful delete of 1 document
        // and then delete (or "pull") the reference to that just deleted document from the kitten document
        $.ajax({
          method: "POST",
          url: "/kittens/removeImageRef/" + currentKittenId,
          data: {imageId: currentImageId}
        })
        .then (function(dbKitten) {
          //console.log("dbKitten after POST/kittens/removeImageRef/id: ", dbKitten);
          // remove modal of deleted image
          $("#bigImageModal").modal("hide");
          // still need to reload the metrics div
          writeKittenDom();
        });
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
    //console.log("I just clicked yes to delete the kitten");
    //console.log("currentUserId: " + currentUserId);
    //console.log("currentKittenId: " + currentKittenId);
    //console.log("CHECK THIS LASTLY!!!! sortedMetricIds: " + sortedMetricIds);
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
        //console.log("dbKitten after delete: ", dbKitten); // shows a successful delete of 1 document
        // and then delete (or "pull") the reference to that just deleted document from the user document
        $.ajax({
          method: "POST",
          url: "/user/removeRef/" + currentUserId,
          data: {kittenId: currentKittenId}
        })
          .then (function(dbUser) {
            //console.log("dbUser after POST/user/removeRef/id: ", dbUser);
            // now delete the metrics referenced from the kitten collection
            for (i=0; i<sortedMetricIds.length; i++) {
              $.ajax({
                method: "DELETE",
                url: "/metrics/delete/" + sortedMetricIds[i]
              })
              .then (function(dbMetric) {
                //console.log("and counter: " + i + "is index to which metric data after deleting a kitten, dbMetric: ", dbMetric);
              });
            }
            // redraw page to show current kittens of current user
            getAllData();
            $("#kittenMetrics").empty();
            $("#chartContainerSize").empty();
            $("#chartContainerWeight").empty();
          });
      });
  });
  
  // User required to pick units for weight of kitten
  // this puts the chosen units into the dropdown button 
  // and sets the variable selText to be the chosen units of the kitten's weight, stored in db
  $("#ulWeight li a").click(function(event){
    event.preventDefault();
    // selText should be available to be put into db
    selText = $(this).text();
    $(this).parents(".btn-group").find("#unitButton").html(selText + " <span class='caret'></span>");
    console.log("selText is: " + selText);
  });

  // Do the same for choosing the units for size of a kitten
  // but need a separate function to set the variable selTextSize 
  // to store the chosen units for the kitten's size
  $("#ulSize li a").click(function(event){
    event.preventDefault();
    selTextSize = $(this).text();
    $(this).parents(".btn-group").find("#unitSizeButton").html(selTextSize + " <span class='caret'></span>");
    console.log("selTextSize is: " + selTextSize);
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
    // console.log("user has clicked on the wrapper!");
    // console.log("littleButton is: " + littleButton);
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
        thisWeightUnit = $(event.target).attr("data_weightunit");
        thisSize = $(event.target).attr("data_size");
        thisSizeUnit = $(event.target).attr("data_sizeunit");
        //console.log("AFTER clicked .metricGroup, thisID: "  + thisId + " and thisKittenId: " + thisKittenId);
        addButtons();
      } else { // user has clicked elsewhere than the metric info div
        //console.log("the current target (click) is NOT the .metricGroup");
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
    //console.log("INSIDE addButtons, thisID: "  + thisId + " and thisKittenId: " + thisKittenId);
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
    //console.log("Inside DELETE set of metric info!");
    removeButtons();
    // delete this group of metric info from the db,
    // First, the id associated with these metrics, and the id of the kitten
    thisId = $(this).attr("data_id");
    thisKittenId = $(this).attr("data_idKitten");
    //console.log("AFTER clicking littleX, thisID: "  + thisId + " and thisKittenId: " + thisKittenId);
    // DELETE these specific metrics from the metrics collection
    $.ajax({
      method: "DELETE",
      url: "/metrics/delete/" + thisId
    })
      .then (function(dbMetric) { 
        //console.log("dbMetric after delete: ", dbMetric); // shows a successful delete of 1 document
        // and then delete (or "pull") the reference to that just deleted document from the kitten document
        $.ajax({
          method: "POST",
          url: "/kittens/removeRef/" + thisKittenId,
          data: {metricId: thisId}
        })
        .then (function(dbKitten) {
          //console.log("dbKitten after POST/kittens/removeRef/id: ", dbKitten);
          // still need to reload the metrics div
          writeKittenDom();
        });
      });
  });
  
  // Function to edit one set of metric info of a kitten, selected by user
  $(document).on("click", ".littleE", function(event) {
    event.preventDefault();
    //console.log("Inside EDIT set of metric info!");
    $(".metricInfo").css({
      'border-width': '1px'
    });
    $(".littleX").remove();
    $(".littleE").remove();
    littleButton = false;
    // bring up modal to edit existing information for this group of kitten metrics
    // check if all the variables are correctly defined
    // console.log("AFTER clicking littleE," +
    // " thisID: "  + thisId + 
    // " thisKittenId: " + thisKittenId +
    // " thisAge:" + thisAge +
    // " thisWeight:" + thisWeight +
    // " thisSize:" + thisSize);
    $("#editKittenMetricModal").modal("show");
    $("#newKittenAgeInput").val(thisAge);
    $("#newKittenWeightInput").val(thisWeight);
    // add value of units to the weight
    // find out what this element is called
    $("#newKittenSizeInput").val(thisSize);
  });

  $(document).on("click", "#submitEditedKittenMetrics", function(event) {
    event.preventDefault();
    //console.log(inside submitEditedKittenMetrics");
    // need to add an id to the dropdown menu???
    $.ajax({
      method: "POST",
      url: "/editMetrics/" + thisId,
      data: {
          age: $("#newKittenAgeInput").val().trim(),
          weight: $("#newKittenWeightInput").val().trim(),
          weightunit: selText,
          size: $("#newKittenSizeInput").val().trim(),
          sizeunit: selTextSize
      }
    })
    .then(function(editedMetricdb) {
        //console.log("User after kitten metrics (allDataKittenUser) in user.js: ", editedMetricdb);
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
  function displayChart() {  // need to add what to do with units for weights
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
    // console.log("before convert, sortedAges: ", sortedAges);
    var sortedAgesNumb = sortedAges.map(Number);
    var sortedSizesNumb = sortedSizes.map(Number);
    var sortedWeightsNumb = sortedWeights.map(Number);
     console.log("after convert, sortedWeightsNumb: ", sortedWeightsNumb);
     console.log("not converted, but - sortedWeightUnits: ", sortedWeightUnits);
     console.log("also not converted, but - sortedSizeUnits: ", sortedSizeUnits);

    // insert a switch to go through the sortedWeightsNumb array and convert the
    // values to ounces IF they are in any other units
    for (i=0; i<sortedWeightsNumb.length; i++) {
      switch(sortedWeightUnits[i]) {
        case "grams":
          sortedWeightsNumb[i] = sortedWeightsNumb[i] * 0.035274;
          console.log("units was grams, now ounces, sortedWeightsNumb[" + i + "]: ", sortedWeightsNumb[i]);
          break;
        case "kilograms":
          sortedWeightsNumb[i] = sortedWeightsNumb[i] * 35.274;
          console.log("units was kilograms, now ounces, sortedWeightsNumb[" + i + "]: ", sortedWeightsNumb[i]);
          break;
        case "pounds":
          sortedWeightsNumb[i] = sortedWeightsNumb[i] * 16;
          console.log("units was pounds, now ounces, sortedWeightsNumb[" + i + "]: ", sortedWeightsNumb[i]);
          break;
        case "ounces":
          console.log(sortedWeightsNumb[i] + " already in ounces"); 
          break;
        default:
          console.log("sortedWeightUnits is not defined?: ", sortedWeightUnits);
      }
    }

    // insert a switch to go through the sortedUnitsNumb array and convert the
    // values to inches IF they are in centimeters (the only other option)
    for (i=0; i<sortedSizesNumb.length; i++) {
      switch(sortedSizeUnits[i]) {
        case "cm":
          sortedSizesNumb[i] = sortedSizesNumb[i] / 2.54;
          console.log("units was cm, now inches, sortedSizesNumb[" + i + "]: ", sortedSizesNumb[i]);
          break;
        case "inches":
          console.log(sortedSizesNumb[i] + " already in inches");
          break;
        default:
          console.log("sortedSizeUnits is not defined?: ", sortedSizeUnits);
      }
    }

    for (i=0; i<sortedAgesNumb.length; i++) {
      resultObjectSize={ x : sortedAgesNumb[i] , y : sortedSizesNumb[i]};
      resultObjectWeight={ x : sortedAgesNumb[i] , y : sortedWeightsNumb[i]};
      // console.log("resultObjectSize: ", resultObjectSize);
      // console.log("resultObjectWeight: ", resultObjectWeight);
      dataPointsArraySize.push(resultObjectSize);
      dataPointsArrayWeight.push(resultObjectWeight);
    }
    // console.log("HERE! the new dataPointsArraySize: ", dataPointsArraySize);
    // console.log("HERE! the new dataPointsArrayWeight: ", dataPointsArrayWeight);
    
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