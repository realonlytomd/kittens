  // This file is just the timer function for feeding the kitten
  // testing to see if this can be called from the user.js file
  // and eventually, can keep the clock running between page changes

  function feedKittenTimer() {
    // function to bring up the countdown clock to feed the kitten
    $(document).on("click", "#feedKitten", function(event) {
      event.preventDefault();
      console.log("click event to feed kitten");
      clickFunction();
    });
  }
    
    function clickFunction() {
      console.log("In clickFunction() on timer.js!");
      stopTimer();

      if ($("#startCount").val() !== undefined) {
        console.log("$('#startCount').val().trim() at beginning of click event: " + $("#startCount").val().trim());
        startCount = $("#startCount").val().trim();
        //reset form after retrieving input so input is undefined
        // for timer to be started from other pages with an undefined input.
        $("#countForm").trigger("reset");
      } else {
        console.log("startCount.val() is undefined! I'm in else.");
        //wait, why is this here??
        // if calling from topic.js, startCount is already retrieved.
        //startCount = localStorage.getItem("startCount");
        console.log("in else, startCount from retrieved in topic.js: " + startCount);
      }
      localStorage.setItem("startCount", startCount);
      console.log("outside of else, startCount written back into localStorage, startCount: " + startCount);
      timer();
    }

    // timer function
    function timer() {
      //this span is in a fixed div so user sees it on page while the timer is running
      // I don't want the timer banner to show
      // if there is no timer, as in, the timer has run out,
      // or has never been set...THAT is what I need to test for
        $("span#timerDisplay").html(startCount);
        if (startCount <= 1) {
          $("span#timerLabel").text(" Minute Left");
          } else {
            $("span#timerLabel").text(" Minutes Left");
          }
        $("#feedTimer").show();
      startCount = --startCount;
      console.log("in function timer() after --startCount, startCount = " + startCount);
      // add play a sound as startCount reaches 0?
      myTimer = setTimeout(function(){ timer() }, 60000);
      console.log("what is myTimer: " + myTimer);
      console.log("typeof myTimer: " + typeof myTimer);
      localStorage.setItem("myTimer", myTimer);
      if (startCount === -1) {
        $("#countForm").trigger("reset");
        $("#feedTheKitten").modal("show");
        stopTimer();
      }
    }

    //stop Timer function
    function stopTimer() {
      clearTimeout(myTimer);
      //$("span#timerLabel").text("");
      $("#feedTimer").hide();
    }
  
