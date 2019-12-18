// this will become the signup and login code for the login.html page
// need a page (or div or modal) for the timer


$(document).ready(function(){
  console.log("hello from login.js");
  // initialize some variables
  var emailInput = "";
  var passwordInput = "";

  // get user input submitted from a new user
  $(document).on("click", "#signupUser", function() {
    emailInput = $("#newEmail-input").val().trim();
    passwordInput = $("#newPassword-input").val().trim();
   // then put these values into the mongo db
    $.ajax({
      method: "GET",
      url: "/createUser",
      data: {
          name: emailInput,
          password: passwordInput
      }
    })
    .then(function(dataCreateUser) {
      console.log("data from creation of new user (dataCreateUser) in login.js: ", dataCreateUser);
    });
    $("#newEmail-input").val("");
    $("#newPassword-input").val("");
  });
  
  
});
