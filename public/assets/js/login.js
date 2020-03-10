// this will become the signup and login code for the login.html page
// 

$(document).ready(function(){
  console.log("hello from login.js");
  // initialize some variables
  var userNameInput = "";
  var passwordInput = "";
  var currentUser = "";
  var currentPassword = "";
  var currentUser_id = "";
  
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
          allUsers[i].loggedIn = true;
          // thinking: don't need loggedIN at all, because multiple users can be logged in
          // at the same time. So, eventually, delete it out of the model
          console.log(allUsers[i].name + " is the current user");
          // and that user's id will be used to post to their data in the db
          currentUser_id = allUsers[i]._id;
          console.log("from login.js, currentUser_id is " + currentUser_id);
          // set to local storage to be accessible in user.js so
          // currently logged in user can post to their db values
          localStorage.setItem('currentUserid', currentUser_id);
          // zero out input fields
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
      // so, this for loop is working,
      // btw, a non-logged in user should have access to topics, but only a 
      // logged in user should be able to add to topics. *important"
      // If it does  -- need to decide where user goes - topic page?
      // List of kittens they have?
      // Instructions about entering kittens.
    });
    $("#userName-input").val("");
    $("#password-input").val("");
  });

  // get user input submitted from a new user
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
    
    // Need to add a check to see that both userNameInput and passwordInput actualy exist
    //
    //
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
      //Once a name and password have been put in user db, now take user to the /user page??
      // Sure..., I guess so
      // set localstorage to the newly created user id so they can input kitten data
      console.log("from login.js, a new user, dataCreateUser._id: " + dataCreateUser._id);
      localStorage.setItem('currentUserid', dataCreateUser._id);
      // but first, zero out input fields
      $("#newUserName-input").val("");
      $("#newPassword-input").val("");
      window.location.replace("/user");
    });
    
  });
  
});
