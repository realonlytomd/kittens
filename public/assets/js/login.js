// this will become the signup and login code for the login.html page
// need a page (or div or modal) for the timer

$(document).ready(function(){
  console.log("hello from login.js");
  // initialize some variables
  var userNameInput = "";
  var passwordInput = "";
  var currentUser = "";
  var currentPassword = "";

  // get user input submitted from a new user
  $(document).on("click", "#signupUser", function(event) {
    event.preventDefault();
    userNameInput = $("#newUserName-input").val().trim();
    passwordInput = $("#newPassword-input").val().trim();
   // then put these values into the mongo db
    $.ajax({
      method: "GET",
      url: "/createUser",
      data: {
          name: userNameInput,
          password: passwordInput
      }
    })
    .then(function(dataCreateUser) {
      console.log("data from creation of new user (dataCreateUser) in login.js: ", dataCreateUser);
    });
    $("#newEmail-input").val("");
    $("#newPassword-input").val("");
  });
  
  //Now need to get users who've already registered and are re-logging in
  // Get their inputs from the html
  $(document).on("click", "#currentUserLogin", function(event) {
    // didn't work previously with the event.preventDefault - always use
    event.preventDefault();
    currentUser = $("#userName-input").val().trim();
    currentPassword = $("#password-input").val().trim();
    console.log("currentUser: " + currentUser);
    console.log("currentPassword: " + currentPassword);
    // Then get all the current users who've ever logged in - dobe!
    $.getJSON("/getAllUsers", function(allUsers) {
      console.log("allUsers after getting them from db: ", allUsers);

      // And compare. Find the matching login user name, and check if the stored
      // email address matches the input from the user.
      
      // If it does  -- need to decide where user goes - topic page?
      // List of kittens they have?
      // Instructions about entering kittens.
    });
  });
  
});
