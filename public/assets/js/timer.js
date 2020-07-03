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
    console.log("In clickFunction() on timer.js! startCount: " + startCount);
    stopTimer();
    console.log("before if, $('#startCount').val(): " + $("#startCount").val());
    console.log("what is type of startCount?: " + typeof startCount);
    // check to see if the input value exists (or is empty or undefined)
    if (($("#startCount").val()))  {
      console.log("$('#startCount').val().trim() at beginning of click event: " + $("#startCount").val().trim());
      startCount = $("#startCount").val().trim();
      console.log("after setting to .val().trim(), startCount: " + startCount);
      //reset form after retrieving input so input is undefined
      // for timer to be started from other pages with an undefined input.
      $("#countForm").trigger("reset");
      console.log("just reset $('#startCount').val(): " + $("#startCount").val());
    } else {
      console.log("startCount.val() is undefined! I'm in else.");
      console.log("in else, startCount retrieved in topic.js, or a return to user.js: " + startCount);
    }
    localStorage.setItem("startCount", startCount);
    console.log("outside of else, startCount written back into localStorage, startCount: " + startCount);
    timer();
  }

  // timer function
  function timer() {
    //this span is in a fixed div so user sees it on page while the timer is running
    // if there is no timer, as in, the timer has run out, 
    // or has never been set...THAT is what I need to test for
    // so the timer banner doesn't show
      $("span#timerDisplay").html(startCount);
      localStorage.setItem("startCount", startCount);
      if (startCount <= 1) {
        $("span#timerLabel").text(" Minute Left");
        } else {
          $("span#timerLabel").text(" Minutes Left");
        }
    $("#feedTimer").show();
    // countdown startCount with a prefix decrement (because I'm doing it AFTER I use it??)
    startCount = startCount - 1;
    console.log("in function timer() after startCount - 1, startCount = " + startCount);
    // add play a sound as startCount reaches 0?
    myTimer = setTimeout(function(){ timer() }, 60000);
    //console.log("what is myTimer: " + myTimer);
    //console.log("typeof myTimer: " + typeof myTimer);
    localStorage.setItem("myTimer", myTimer);
    if (startCount === -1) {
      $("#countForm").trigger("reset");
      $("#feedTheKitten").modal("show");
      localStorage.setItem("startCount", startCount);
      stopTimer();
    }
  }

  //stop Timer function
  function stopTimer() {
    clearTimeout(myTimer);
    $("#feedTimer").hide();
  }
  
