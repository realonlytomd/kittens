// this will become the signup and login code for the login.html page
// 
// initialize input variables
var userNameInput = "";
var passwordInput = "";
var currentUser = "";
var currentPassword = "";
var currentUser_id = "";
var currentUserLoggedIn; // set to local storage, so needs to be a string
var qOneInput;
var qTwoInput;
var qThreeInput;
// the three answers from db for the current user trying to log in is temp. stored in these vars
var qOneDb;
var qTwoDb;
var qThreeDb;
// don't think this is needed for security question asking becuase just need one user
// var allUsers; // this variable is all the info with every user. need it to compare passwords and sec. quesetions
// var i; // this is the index of the currently logged in user. used for same reason as above.
jQuery.noConflict();
jQuery(document).ready(function( $ ){
  //console.log(hello from login.js");
  //console.log(currentUserLoggedIn is: " + currentUserLoggedIn);

  // code to add functionality to visiblity eye icon in password input field.
  $(document).on("click", "#togglePassword", function(event) {
    event.preventDefault();
    console.log("inside togglePassword");
    // toggle the type attribute
    const type = $("#password-input").attr("type") === "password" ? "text" : "password";
    $("#password-input").attr("type", type);
    // toggle the eye slash icon
    $(this).classList.toggle("fa-eye-slash");
  });

   //For users who've already registered and are re-logging in
  $(document).on("click", "#currentUserLogin", function(event) {
    // didn't work previously without the event.preventDefault - always use
    event.preventDefault();
    currentUser = $("#userName-input").val().trim();
    //console.log(before change to cap currentUser: " + currentUser);
    currentUser = currentUser.charAt(0).toUpperCase() + currentUser.slice(1).toLowerCase();
    //console.log(after cap change currentUser: " + currentUser);
    currentPassword = $("#password-input").val().trim();
    //console.log(currentPassword: " + currentPassword);
    // I'm commenting out the following line, as some users would like different cases for password
    // currentPassword = currentPassword.toLowerCase();
    // console.log("after currentPassword: " + currentPassword);
    // Then get all the current users who've ever logged in 
    $.getJSON("/getAllUsers", function(allUsers) {
      //console.log(allUsers after getting them from db: ", allUsers);
      // And compare. Find the matching login user name, and check if the stored
      // email address matches the input from the user.
      for (i = 0; i < allUsers.length; i++) {
        //console.log(allUsers[i].name= " + allUsers[i].name);
        //console.log(allUsers[i].password= " + allUsers[i].password);
        if ((currentUser === allUsers[i].name) && (currentPassword === allUsers[i].password)) {
          // THIS is where a current user's logged in status is set to "true".
          // the db for users will always have their status set to "false".
          // It's never overwritten. Only while logged in on the user's brower
          currentUserLoggedIn = "true";
          console.log(allUsers[i].name + " is the current user");
          // and that user's id will be used to post to their data in the db
          currentUser_id = allUsers[i]._id;
          //console.log(from login.js, currentUser_id is " + currentUser_id);
          // set to local storage to be accessible in user.js so
          // currently logged in user can post to their db values
          localStorage.setItem("currentUserId", currentUser_id);
          // also need to remember this user is loggedIn, so "true"
          localStorage.setItem("currentUserLoggedIn", currentUserLoggedIn);
          // set the now logged in currentUser to localStorage to be used in topics.js as author
          localStorage.setItem("currentUser", currentUser);
          // clear input fields
          $("#userName-input").val("");
          $("#password-input").val("");
          // take correctly logged in user to /user.
          // if they don't have the correct login, then take them back to login page@!!!!!!
          window.location.replace("/user");
          return;
          // run another if - if the person trying to log in is currently in the db, get their answers
          // to the  security questions, set the loggedIn to false so we know they have a registration,
          // then ask them to try again or reset their password.
        } else if (currentUser === allUsers[i].name) {
          console.log(allUsers[i].name + " does not have correct password input");
          //console.log(currentUser: " + currentUser + " is the user currently logging in");
          // answers to security questions stored in db
          qOneDb = allUsers[i].questionOne;
          qTwoDb = allUsers[i].questionTwo;
          qThreeDb = allUsers[i].questionThree;
          //console.log(Their current answers to the sec. q's from db: qOneDB, qTwoD, qThreeDb are: " + qOneDb + " " + qTwoDb + " " + qThreeDb);
          // since we know that a registered user is trying to log in, set their currentUserLoggedIn status
          currentUserLoggedIn = "false";  // instead of undefined, as it would be for a non-registered user
          // for now, assuming that the user name is correct, but password is wrong
          var questions = "The information you entered is incorrect." + 
          "\nClick Cancel to try again, or click OK to reset your password."
            // using an alert 
          if (confirm(questions)) {
            //console.log(user wishes to change password");
            // The id secQAnswer modal appears asking the user to re-answer their original 3 security questions
            $("#secQAnswer").modal("show");
            // when the user clicks the submit button in that modal, the function below:
            // #submitSecQ is called.
          }
          return;
        } else {
          // may add an alert this effect
          console.log("person trying to log in has not entered a username in db");
        }
      }
    });
    $("#userName-input").val("");
    $("#password-input").val("");
  });

  // function called from inside modal to answer the security questions
  // This needs to apply to both new users, and users trying to reset their passwords
  //  The modal with submit id=submitSecQ is pulled up also from signing up a new user
  $(document).on("click", "#submitSecQ", function(event) {
    event.preventDefault();
    //console.log(inside function that compares security questions to previous answers");
    // hide the previous modal
    $("#secQAnswer").modal("hide");
    // retrieve the user inputted values and assign them to reanswer variables.
    qOneInput = $("#secQOne").val().trim();
    qTwoInput = $("#secQTwo").val().trim();
    qThreeInput = $("#secQThree").val().trim();
    //console.log(Their current answers to security q's: " + qOneInput + " " + qTwoInput + " " + qThreeInput);

    //
    // need if statement, if first time user signup, 
    // currentUserLoggedIn will be undefined because user hasn't logged in ever,
    // then call function to put this data in db
    //console.log(currentUserLoggedIn, before checking if !== false: " + currentUserLoggedIn);
    if (currentUserLoggedIn !== "false") {
      // call function to put a new user info in db
      //console.log(inside currentUserLoggedIn, !== false, so it's a new user...");
      putUserInfoDb();
      return;
    } else { // a current user is trying to reset their password
      // compare these security questions with db, 
      console.log("a registered user is trying to reset their password");
      // but just for THE USER TRYING TO LOGIN
      // we have current security questions answers: 
      // qOneInput, qTwoInput, qThreeInput 
      // need the old security answers out of db for the user. They are 
      // qOneDB, qTwoD, qThreeDb
      // compare the new answers with the old answers
      if ((qOneInput === qOneDb) && (qTwoInput === qTwoDb) && (qThreeInput === qThreeDb)) {
        // security questions are correct, this is the correct user
        // so reset their password
        // pull up the modal to reset the password...
        //console.log(correct answers, so need to reset user's password");
        $("#passwordReset").modal("show");
        // build funtion that takes answer to resetting password
      }
      // if not, tell user to try again.
      // What to do if user is never correct?
    }
    // empty out inputs for security questions
    $("#secQOne").val("");
    $("#secQTwo").val("");
    $("#secQThree").val("");
  });

  // function called from inside modal to reset password
  $(document).on("click", "#submitNewPass", function(event) {
    event.preventDefault();
    //console.log(inside function to reset password of user in the db");
    // get user inputs to new password and confirmation
    newPassInput = $("#newPassword1").val().trim();
    newPassConfirmInput = $("#newPassword2").val().trim();
    // compare the two answers to make sure they are the same
    if (newPassInput === newPassConfirmInput) {
      // route the input to api to store in user's db
      $.ajax({
        method: "POST",
        url: "/updatePassword/" + currentUser,
        data: {
            name: currentUser,
            password: newPassInput
        }
      })
      .then(function(dataNewPassword) {
        //console.log(data from changing user's password in db, login.js: ", dataNewPassword);
        $("#newPassword1").val("");
        $("#newPassword2").val("");
        $("#passwordReset").modal("hide");
      });
    } else {
      alert ("Your passwords do not match." + "\nPlease try again.");
      $("#newPassword1").val("");
      $("#newPassword2").val("");
    }
  });

  // get user input submitted from a new user
  // need to add storage of security questions....
  $(document).on("click", "#signupUser", function(event) {
    event.preventDefault();
    userNameInput = $("#newUserName-input").val().trim();
    //console.log(before userNameInput: " + userNameInput);
    
    userNameInput = userNameInput.charAt(0).toUpperCase() + userNameInput.slice(1).toLowerCase();
    
    //console.log(after userNameInput: " + userNameInput);
    passwordInput = $("#newPassword-input").val().trim();
    //console.log(passwordInput: " + passwordInput);
    // passwordInput = passwordInput.toLowerCase();
    // console.log("after passwordInput: " + passwordInput);

    // bring up modal to answer security questions.
    $("#secQAnswer").modal("show");
  });

  function putUserInfoDb() {
    jQuery.noConflict();
    jQuery(document).ready(function( $ ){
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
        //console.log(data from creation of new user (dataCreateUser) in login.js: ", dataCreateUser);
        //Once a name and password have been put in user db, now take user to the /user page
        // set localstorage to the newly created user id so they can input kitten data
        //console.log(from login.js, a new user, dataCreateUser._id: " + dataCreateUser._id);
        //console.log(from login.js, a new user, dataCreateUser.name: " + dataCreateUser.name);
        localStorage.setItem("currentUserId", dataCreateUser._id);
        localStorage.setItem("currentUserLoggedIn", dataCreateUser.loggedIn);
        // set the now logged in currentUser to localStorage to be used in topics.js as author
        localStorage.setItem("currentUser", dataCreateUser.name);
        //console.log(This is currentUserLoggedIn after putting user in db: " + dataCreateUser.loggedIn);
        // but first, zero out input fields
        $("#newUserName-input").val("");
        $("#newPassword-input").val("");
        window.location.replace("/user");
      });
    });
  }
});
