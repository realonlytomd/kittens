// this will become the signup and login code for the login.html page
// 
// initialize input variables
var userNameInput = "";
var passwordInput = "";
var currentUser = "";
var currentPassword = "";
var currentUser_id = "";
var currentUserLoggedIn;
var qOneInput;
var qTwoInput;
var qThreeInput;
// don't think this is needed for security question asking becuase just need one user
// var allUsers; // this variable is all the info with every user. need it to compare passwords and sec. quesetions
// var i; // this is the index of the currently logged in user. used for same reason as above.
$(document).ready(function(){
  console.log("hello from login.js");
  console.log("what is currentUserLoggedIn: " + currentUserLoggedIn);
  
  
   //Get users who've already registered and are re-logging in
  // Get their inputs from the html
  $(document).on("click", "#currentUserLogin", function(event) {
    // didn't work previously without the event.preventDefault - always use
    event.preventDefault();
    currentUser = $("#userName-input").val().trim();
    console.log("before currentUser: " + currentUser);
    currentUser = currentUser.charAt(0).toUpperCase() + currentUser.slice(1).toLowerCase();
    console.log("after currentUser: " + currentUser);
    currentPassword = $("#password-input").val().trim();
    console.log("before currentPassword: " + currentPassword);
    currentPassword = currentPassword.toLowerCase();
    console.log("after currentPassword: " + currentPassword);
    // Then get all the current users who've ever logged in 
    $.getJSON("/getAllUsers", function(allUsers) {
      console.log("allUsers after getting them from db: ", allUsers);

      // And compare. Find the matching login user name, and check if the stored
      // email address matches the input from the user.
      for (i = 0; i < allUsers.length; i++) {
        console.log("allUsers[i].name= " + allUsers[i].name);
        console.log("allUsers[i].password= " + allUsers[i].password);
        if ((currentUser === allUsers[i].name) && (currentPassword === allUsers[i].password)) {
          // THIS is where a current user's logged in status is set to "true".
          // the db for users will always have their status set to "false".
          // It's never overwritten. Only while logged in on the user's brower
          allUsers[i].loggedIn = "true";
          console.log(allUsers[i].name + " is the current user");
          // and that user's id will be used to post to their data in the db
          currentUser_id = allUsers[i]._id;
          console.log("from login.js, currentUser_id is " + currentUser_id);
          // set to local storage to be accessible in user.js so
          // currently logged in user can post to their db values
          localStorage.setItem("currentUserId", currentUser_id);
          // also need to remember this user is loggedIn, so "true"
          localStorage.setItem("currentUserLoggedIn", allUsers[i].loggedIn);
          // clear input fields
          $("#userName-input").val("");
          $("#password-input").val("");
          // take correctly logged in user to /user.
          // if they don't have the correct login, then take them back to login page@!!!!!!
          // add this later
          window.location.replace("/user");
          return;
        } else {
          console.log(allUsers[i].name + " is not the current user");
        }
      }
      console.log("this log in doesn't match any users in db");
      var questions = "The information you entered is incorrect." + 
        "\nClick Cancel to try again, or click OK to reset your password."
      if (confirm(questions)) {
        console.log("user wishes to change password");
        // A modal appears asking the user to re-answer their original 3 security questions
        $("#secQAnswer").modal("show");
        // when the user clicks the submit button in that modal, the function below:
        // #submitSecQ is called.
        //
      }
    });
    $("#userName-input").val("");
    $("#password-input").val("");
  });

  // function called from inside modal to answer the security questions
  $(document).on("click", "#submitSecQ", function(event) {
    event.preventDefault();
    console.log("inside function that compares security questions to previous answers");
    // hide the previous modal
    $("#secQAnswer").modal("hide");
    // retrieve the user inputted values and assign them to reanswer variables.
    qOneInput = $("#secQOne").val().trim();
    qTwoInput = $("#secQTwo").val().trim();
    qThreeInput = $("#secQThree").val().trim();
    //
    // need if statement, if first time user signup, 
    // currentUserLoggedIn will be undefined because user hasn't logged in ever,
    // then call function to put this data in db
    if (currentUserLoggedIn !== false) {
      // call function to put a new user info in db
      console.log("inside currentUserLoggedIn !== false, so it's a new user...");
      putUserInfoDb();
      
    } else { // a current user is trying to reset their password
      // currentUserLoggedIn will be false, since user is not logged in
      // compare these security questons with db, 
      console.log("a registered user is trying to reset their password");
      //get current security questions out of db
      // but just for THE CURRENT USER TRYING TO LOGIN

      // compare the new answers with the old answers
      
      // if correct
      // pull up the modal to reset the password if that's what we're needing to do.
      $("#passwordReset").modal("show");
      // if not, tell user to try again.
      // What to do if user is never correct?
    }
    // empty out inputs for security questions
    $("#secQOne").val("");
    $("#secQTwo").val("");
    $("#secQThree").val("");
  });

  // get user input submitted from a new user
  // need to add storage of security questions....
  $(document).on("click", "#signupUser", function(event) {
    event.preventDefault();
    userNameInput = $("#newUserName-input").val().trim();
    console.log("before userNameInput: " + userNameInput);
    
    userNameInput = userNameInput.charAt(0).toUpperCase() + userNameInput.slice(1).toLowerCase();
    
    console.log("after userNameInput: " + userNameInput);
    passwordInput = $("#newPassword-input").val().trim();
    console.log("before passwordInput: " + passwordInput);
    passwordInput = passwordInput.toLowerCase();
    console.log("after passwordInput: " + passwordInput);

    // bring up modal to answer security questions.
    $("#secQAnswer").modal("show");

    // 
  });

  function putUserInfoDb() {
  // Need to add a check to see that both userNameInput and passwordInput actualy exist
    //
    // then put these values into the mongo db
    $.ajax({
      method: "GET",
      url: "/createUser",
      data: {
          name: userNameInput,
          password: passwordInput,
          questionOne: qOneInput,
          questionTwo: qTwoInput,
          questionThree: qThreeInput,
          loggedIn: "true"
      }
    })
    .then(function(dataCreateUser) {
      console.log("data from creation of new user (dataCreateUser) in login.js: ", dataCreateUser);
      //Once a name and password have been put in user db, now take user to the /user page
      // set localstorage to the newly created user id so they can input kitten data
      console.log("from login.js, a new user, dataCreateUser._id: " + dataCreateUser._id);
      localStorage.setItem("currentUserId", dataCreateUser._id);
      localStorage.setItem("currentUserLoggedIn", dataCreateUser.loggedIn);
      console.log("This is currentUserLoggedIn after putting user in db: " + dataCreateUser.loggedIn);
      // but first, zero out input fields
      $("#newUserName-input").val("");
      $("#newPassword-input").val("");
      window.location.replace("/user");
    });
  }
    
  
  
});
