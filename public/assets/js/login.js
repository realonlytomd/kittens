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
          password: passwordInput,
          loggedIn: true
      }
    })
    .then(function(dataCreateUser) {
      console.log("data from creation of new user (dataCreateUser) in login.js: ", dataCreateUser);
    });
    $("#newUserName-input").val("");
    $("#newPassword-input").val("");
  });
  
  //Now need to get users who've already registered and are re-logging in
  // Get their inputs from the html
  $(document).on("click", "#currentUserLogin", function(event) {
    // didn't work previously without the event.preventDefault - always use
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
      for (i = 0; i < allUsers.length; i++) {
        console.log("allUsers[i].name= " + allUsers[i].name);
        console.log("allUsers[i].password= " + allUsers[i].password);
        if ((currentUser === allUsers[i].name) && (currentPassword === allUsers[i].password)) {
          allUsers[i].loggedIn = true;
          console.log(allUsers[i].name + " is the current user");
        } else {
          console.log(allUsers[i].name + " is not the current user");
        }
      }
      // so, this for loop is working, but I should stop as the correct user is reached?
      // take the user to the /user page.
      // Make the user page where they see kittens,
      // and can input more topics.
      // btw, a non-logged in user should have access to topics, but only a 
      // logged in user should be able to add to topics. *important"
      // If it does  -- need to decide where user goes - topic page?
      // List of kittens they have?
      // Instructions about entering kittens.
    });
    $("#userName-input").val("");
    $("#password-input").val("");
  });
  
});
