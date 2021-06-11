var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// these two are from showing images in mongodb process:
var fs = require('fs');
var path = require('path');


var sortAges = require("sort-ids");
var reorder = require("array-rearrange");

// Require all models
// MIGHT not need this here - leftover from news scraper app that had everything in server file
var imgModel = require('./model');

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

//Step 5
// var multer = require('multer');
 
// var storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now())
//     }
// });
//var upload = multer({ storage: storage });

// Step 7 - the GET request handler that provides the HTML UI
 
// app.get('/', (req, res) => {
//   imgModel.find({}, (err, items) => {
//       if (err) {
//           console.log(err);
//           res.status(500).send('An error occurred', err);
//       }
//       else {
//           res.render('/user', { items: items });  //I just added the / in front of user (no idea)
//       }
//   });
// });

// Step 8 - the POST handler for processing the uploaded file
 
// app.post('/', upload.single('image'), (req, res, next) => {
 
//   var obj = {
//       name: req.body.name,
//       desc: req.body.desc,
//       img: {
//           data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
//           contentType: 'image/png'
//       }
//   }
//   imgModel.create(obj, (err, item) => {
//       if (err) {
//           console.log("getting an error!!: ", err);
//       }
//       else {
//           item.save();  // save() is a mongoose function
//           res.redirect("/user");
//       }
//   });
// });

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
