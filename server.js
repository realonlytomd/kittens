var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");
// var cheerioAdv = require("cheerio-advanced-selectors");

// // require array sort npms
// // requirejs added so require can be used client side
// var requirejs = require('requirejs');
// requirejs.config({
//   //Pass the top-level main.js/index.js require
//   //function to requirejs so that node modules
//   //are loaded relative to the top-level JS file.
//   nodeRequire: require
// });
var sortAges = require("sort-ids");
var reorder = require("array-rearrange");

// Require all models
var db = require("./models");

// make port ready for deployment on heroku as well as local
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();


//  morgan logger for logging requests
app.use(logger("dev"));
//  body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
//  express.static to serve the public folder as a static directory
app.use(express.static("public"));

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
//may not need this since I added the function(err) callback below
mongoose.Promise = Promise;
// set up for deploying on heroku and developing local
  if (process.env.DB_URI) {
    mongoose.connect(process.env.DB_URI);
  } else {
    mongoose.connect("mongodb://localhost:27017/littlecats", { 
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      useFindAndModify: false
    }, function(err){
      if(err){
      console.log("am I gettting an error?", err);
    } else {
      console.log("mongoose connection is successful on: " + "mongodb://localhost:27017/littlecats");
    }
   });
  }
// previous code (from class). Keeping for reference
//var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/littlecats", { useNewUrlParser: true };
//mongoose.connect(MONGODB_URI);
//mongoose.connect('mongodb://localhost:27017/Notification',{ useNewUrlParser: true });

// // Routes
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
