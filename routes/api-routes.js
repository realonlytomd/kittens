//  need to change to kittens. most of the functions remain however
// nothing in timer
//
// new file that contains the api route information.
// moved from server.js file
//
var express = require("express");
var router = express.Router();
var db = require("../models");
// Routes
module.exports = function(router) {
    // the CREATE route for storing a new topic and answer provided by a user
    router.get("/createTopic", function(req, res) {
        console.log("from /createTopic, req.query: ", req.query);
        db.Topic.create(req.query)
            .then(function(dbTopic) {
                // View the added result in the console
            console.log("what was created in the topics db, dbTopic: ", dbTopic);
            res.json(dbTopic);
            })
            .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
            });
    });

    // Route for getting all of the Topics from the db
    router.get("/getAllTopics", function(req, res) {
        db.Topic.find({})
            .then(function(dbAllTopics) {
            res.json(dbAllTopics);
            console.log("dbAllTopics from  route /getAllTopics: ", dbAllTopics);
            })
            .catch(function(err) {
            // However, if an error occurred, send it to the client
            res.json(err);
            });
    });

    // Route for creating a new user
    // off the top of my head... dbUser can be set up above as a variable
    // that is stored outside of just this function.
    // that way, when  user currently logged in, (loggedIn === true),
    // their user_id can be trieved and set back, so new kitten storage can be made
    // just to that user.
    // need to be sure it's also available with a user that has just logged in, 
    // not just a new user.
    router.get("/createUser", function(req, res) {
        console.log("from /createUser, req.query: ", req.query);
        db.User.create(req.query)
            .then(function(dbUser) {
                // View the added result in the console
            console.log("what was created in the user db, dbUser: ", dbUser);
            res.json(dbUser);
            })
            .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
            });
    });

    // Route for getting all of the Users from the db
    // For login.js
    router.get("/getAllUsers", function(req, res) {
        db.User.find({})
            .then(function(dbAllUsers) {
            res.json(dbAllUsers);
            console.log("dbAllUsers from  route /getAllUsers: ", dbAllUsers);
            })
            .catch(function(err) {
            // However, if an error occurred, send it to the client
            res.json(err);
            });
    });

    // Route for getting a specific User by id, and then populate it with a kitten
    router.get("/popUser/:id", function(req, res) {
        // Using the id passed in the id parameter, and make a query that finds the matching one in the db
            db.User.findOne({ _id: req.params.id })
                // then populate the kitten schema associated with it
                .populate([
                    {
                        path: "kitten",
                        model: "Kitten",
                        populate: {
                            path: "metric",
                            model: "Metric"
                        }
                    }
                ])
                .then(function(dbUser) {
                // If successful, find a User with the given id, send it back to the client
                console.log("api-routes.js, JUST POPULATE USER, dbUser: ", dbUser);
                res.json(dbUser);
                })
                .catch(function(err) {
                // but if an error occurred, send it to the client
                res.json(err);
                });
        });

    // need to find the correct user, then fill in the data (name) with the new kitten array
    router.post("/createKitten/:id", function(req, res) {
        console.log("BEFORE CREATE KITTEN - req.body: ", req.body);
        //insert creation of the kitten's metrics
            db.Kitten.create(req.body)
            .then(function(dbKitten) {
                console.log("AFTER .CREATE KITTEN - api-routes.js, dbKitten: ", dbKitten);
                // pushing the new kitten name into the document kitten array
            return db.User.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { kitten: dbKitten._id } }, 
                { new: true }
                );
            })
            .then(function(dbUser) {
                // send back the correct user with new data in the kitten arrays
                res.json(dbUser);
                console.log("AFTER CORRECT USER UPDATED - dbUser: ", dbUser);
            })
            .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
            });
    });

    // need to find the correct kitten, then fill in the metrics with the selected metric array
    router.post("/kittenMetrics/:id", function(req, res) {
        console.log("BEFORE KITTEN HAS METRICS - req.body: ", req.body);
        //insert creation of the kitten's metrics
            db.Metric.create(req.body)
            .then(function(dbMetric) {
                console.log("AFTER .CREATE METRICS - api-routes.js, dbMetric: ", dbMetric);
                // pushing the new kitten name into the document kitten array
            return db.Kitten.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { metric: dbMetric._id } }, 
                { new: true }
                );
            })
            .then(function(dbKitten) {
                // send back the correct user with new data in the metric arrays
                res.json(dbKitten);
                console.log("AFTER KITTEN UPDATED - dbKitten: ", dbKitten);
            })
            .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
            });
    });

    // first attempt at the Route for getting all of the kittens from a particular user from the db
    // not right: need the particlar user, then out of that user, get the kittens name,
    // and metrics....
    //This .get only gets the current user
    router.get("/getCurrentUser:id", function(req, res) {
        console.log("inside api-routes: req.params: ", req.params);
        // need to find the correct user, THEN all their kittens, 
        db.User.find({ _id: req.params.id}) // This is to limit the find to just current user
            .then(function(dbCurrentUser) {
                res.json(dbCurrentUser);
                console.log("from  route /getCurrentUser:id, dbCurrentUser: ", dbCurrentUser);
            })
            .catch(function(err) {
            // However, if an error occurred, send it to the client
            res.json(err);
            });
    });

    // **********older code, using for reference*******888
    // the GET route for scraping The Verge's website
    router.get("/scrape", function(req, res) {
        
    }); // this ccompletes the /scrape function
    
    // Route for getting all of the Articles from the db
    router.get("/articles", function(req, res) {
        // this should become toe find all for the topics db retrieval
        db.Article.find({})
            .then(function(dbArticle) {
            // If that worked, send them back to the client
            //console.log("after relist articles button clicked, (find({})dbArticle): " + dbArticle);
            res.json(dbArticle);
            })
            .catch(function(err) {
            // However, if an error occurred, send it to the client
            res.json(err);
            });
    });
    
    // Route for getting a specific Article by id, and then populate it with it's note
    router.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, and make a query that finds the matching one in the db
        db.Article.findOne({ _id: req.params.id })
            // then populate all of the notes associated with it
            .populate("note")
            .then(function(dbArticle) {
            // If successful, find an Article with the given id, send it back to the client
            res.json(dbArticle);
            })
            .catch(function(err) {
            // but if an error occurred, send it to the client
            res.json(err);
            });
    });
    
    // Route for saving and/or updating an Article's associated Note
    router.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. 
        // Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User,
        // it returns only the original by default
        //  the Mongoose query returns a promise, we can chain another `.then` 
        // which receives the result of the query
            return db.Article.findOneAndUpdate(
                { _id: req.params.id }, 
                { note: dbNote._id }, 
                { new: true });
            })
            .then(function(dbArticle) {
            // If successful in updating an Article, send it back to the client
            res.json(dbArticle);
            })
            .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
            });
    });
    
    // Route for deleting an Article's associated Note
    router.delete("/articles/:id", function(req, res) {
    // delete the note and pass the req.body to the entry
        db.Note.deleteOne({ _id: req.params.id })
            .then(function(dbNote) {
            // If a Note was deleted successfully, 
            // the following is much like saving a note
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
            })
            .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
            });
    });
    
    // Route for getting a specific Article by id, and then deleting it
    router.delete("/articles/test/:id", function(req, res) {
    // Using the title passed in the title parameter, and make a query that finds the matching one in the db
        console.log("this is the id of the doc I want to delete: " + req.params.id);
        db.Article.deleteOne({ _id: req.params.id })
            .then(function(dbArticle) {
            // If successful, give the list without the given title, send it back to the client 
            res.json(dbArticle);
            })
            .catch(function(err) {
            // but if an error occurred, send it to the client
            res.json(err);
            });
    });
};