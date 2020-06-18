  // This file is just the timer function for feeding the kitten
  // testing to see if this can be called from the user.js file
  // and eventually, can keep the clock running between page changes
function feedKittenTimer() {
  // function to bring up the countdown clock to feed the kitten
  $(document).on("click", "#feedKitten", function(event) {
    event.preventDefault();
    // need to get inputs from user on how long to set the timer for
    stopTimer();
    startCount = $("#startCount").val().trim();
    console.log("startCount: " + startCount);
    timer();
  });

  // timer function
  function timer() {
    //this span is in a fixed div so user sees it on page while the
    //timer clock is running.
    $("span#timerDisplay").html(startCount);
    if (startCount <= 1) {
      $("span#timerLabel").text(" Minute Left");
      } else {
        $("span#timerLabel").text(" Minutes Left");
      }
    $("#feedTimer").show();
    startCount = startCount - 1;
    console.log("startCount = " + startCount);
    // add play a sound as startCount reaches 0
    myTimer = setTimeout(function(){ timer() }, 60000);
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
}