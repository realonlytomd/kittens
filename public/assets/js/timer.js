  // This file is just the timer function for feeding the kitten
  // testing to see if this can be called from the user.js file
  // and eventually, can keep the clock running between page changes

  function feedKittenTimer() {
    // function to bring up the countdown clock to feed the kitten
    $(document).on("click", "#feedKitten", function(event) {
      event.preventDefault();
      clickFunction();
    });
  }
    
    function clickFunction() {
      // need to get inputs from user on how long to set the timer for
      
      stopTimer();
      if ($("#startCount").val() !== undefined) {
        console.log("$('#startCount').val().trim() at beginning of click event: " + $("#startCount").val().trim());
        startCount = $("#startCount").val().trim();
        //reset form after retrieving input so input is undefined
        // for timer to be started from other pages
        $("#countForm").trigger("reset");
      } else {
        startCount = localStorage.getItem("startCount");
      }
      localStorage.setItem("startCount", startCount);
      console.log("startCount: " + startCount);
      timer();
    }

    // timer function
    function timer() {
      //this span is in a fixed div so user sees it on page while the
      //timer clock is running.

      // this if is messed up - I don't want the timer banner to show
      // if there is no timer, as in, the timer has run out,
      // or has never been set...THAT is what I need to test for
      if ((startCount !== undefined) || (startCount > 0)) {
        $("span#timerDisplay").html(startCount);
        if (startCount <= 1) {
          $("span#timerLabel").text(" Minute Left");
          } else {
            $("span#timerLabel").text(" Minutes Left");
          }
        $("#feedTimer").show();
      }
      startCount = startCount - 1;
      console.log("startCount = " + startCount);
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
  
