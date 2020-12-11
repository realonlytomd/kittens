
// nothing in timer
//
// new file that contains the api route information.
// moved from server.js file
//
var express = require("express");
var router = express.Router();
var db = require("../models");
// require method to sort ages array by number
var sortAges = require("sort-ids");
var reorder = require("array-rearrange");

// initialize sorted arrays
var sortedIds = [];
var sortedAges = [];
var sortedWeights = [];
var sortedSizes = [];

// Routes
module.exports = function(router) {

    // route to take kitten metric arrays into the server side,
    // and perform sort fuctions (using require("sort-ids")) that isn't available client side,
    // and then feed it back to the client to be displayed on DOM
    router.get("/sortArrays/", function(req, res) {
        console.log("from /sortArrays, req.query: ", req.query);
        console.log("from /sortArrays, req.query.ids: ", req.query.ids);
        console.log("from /sortArrays, req.query.ages: ", req.query.ages);
        console.log("from /sortArrays, req.query.weights: ", req.query.weights);
        console.log("from /sortArrays, req.query.sizes: ", req.query.sizes);
        // need to convert the numbers in ages array from strings to number
        var kittenAges = req.query.ages;
        numberKittenAges = kittenAges.map(Number);
        console.log("numberKittenAges: ", numberKittenAges);
        var newIndex = sortAges(numberKittenAges);
        console.log("newIndex: ", newIndex);
        // reorder method below seems to be breaking, so do a for loop to reorder arrays
        for (var i=0; i<numberKittenAges.length; i++) {
            sortedIds[i]=req.query.ids[newIndex[i]];
            sortedAges[i]=req.query.ages[newIndex[i]];
            sortedWeights[i]=req.query.weights[newIndex[i]];
            sortedSizes[i]=req.query.sizes[newIndex[i]];
        }
        console.log("sortedIds: " + sortedIds);
        console.log("sortedAges: " + sortedAges);
        console.log("sortedWights: " + sortedWeights);
        console.log("sortedSizes: " + sortedSizes);
        var sortedMetrics = {
            ids: sortedIds,
            ages: sortedAges,
            weights: sortedWeights,
            sizes: sortedSizes
        };
        console.log("sortedMetrics: ", sortedMetrics);
        res.json(sortedMetrics);
        sortedIds = [];
        sortedAges = [];
        sortedWeights = [];
        sortedSizes = [];
    });

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

    // Route to provide answer to an asked Topic (question)
    router.post("/answerTopic/:topic", function(req, res) {
        console.log("req.body.topic: ", req.body.topic);
        console.log("req.body.answer: ", req.body.answer);
        console.log("req.body.answerAuthor: ", req.body.answerAuthor);
        // Using the id passed in the id parameter, and make a query that finds the matching one in the db
        db.Topic.findOneAndUpdate(
            { topic: req.body.topic },
            {$set: { answer: req.body.answer , answerAuthor: req.body.answerAuthor }},
            { new: true }
        )
            .then(function(dbTopic) {
                console.log("dbTopic: ", dbTopic);
                // If successful, send the answered Topic back to the client
                res.json(dbTopic);
            })
            .catch(function(err) {
            // but if an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for creating a new user
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

    //Route to change a user's password
    // CHECK THIS!
    router.post("/updatePassword/:currentUser", function(req, res) {
        console.log("req.body.name: ", req.body.name);
        console.log("req.body.password: ", req.body.password);
        // Using the id passed in the id parameter, and make a query that finds the matching one in the db
        db.User.findOneAndUpdate(
            { name: req.body.name },
            { password: req.body.password },
            { new: true }
        )
            .then(function(dbUser) {
                console.log("dbUser: ", dbUser);
                // If successful, send the user and new password back to the client
                res.json(dbUser);
            })
            .catch(function(err) {
            // but if an error occurred, send it to the client
                res.json(err);
            });
    });


    // Route for logging out a specific User by id
    router.post("/logoutUser/:id", function(req, res) {
        console.log("req.body._id: ", req.body._id);
        console.log("req.body.loggedIn: ", req.body.loggedIn);
        // Using the id passed in the id parameter, and make a query that finds the matching one in the db
        db.User.findOneAndUpdate(
            { _id: req.body._id },
            { loggedIn: req.body.loggedIn },
            { new: true }
        )
            .then(function(dbUser) {
                console.log("dbUser: ", dbUser);
                // If successful, send the correct User back to the client
                res.json(dbUser);
            })
            .catch(function(err) {
            // but if an error occurred, send it to the client
                res.json(err);
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
                // send back the correct kitten with new data in the metric arrays
                res.json(dbKitten);
                console.log("AFTER KITTEN UPDATED - dbKitten: ", dbKitten);
            })
            .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
            });
    });

    // Route for getting all of the kittens from a particular user from the db
    //This .get only gets the current user
    router.get("/getCurrentUser:id", function(req, res) {
        console.log("inside api-routes: /getCurrentUser:id, req.params: ", req.params);
        // need to find the correct user, THEN all their kittens, 
        db.User.find({ _id: req.params.id}) // This is to limit the find to just current user
            .then(function(dbCurrentUser) {
                res.json(dbCurrentUser);
                console.log("from  route /getCurrentUser:id, dbCurrentUser: ", dbCurrentUser);
                console.log("dbCurrentUser.kitten.length: ", dbCurrentUser[0].kitten.length);
            })
            .catch(function(err) {
            // However, if an error occurred, send it to the client
            res.json(err);
            });
    });

    //This route gets one kitten document from kitten collection
    router.get("/getAKitten:id", function(req, res) {
        console.log("inside api-routes: req.params: ", req.params);
        // need to find the correct user, THEN all their kittens, 
        db.Kitten.find({ _id: req.params.id})
            .then(function(dbAKitten) {
                res.json(dbAKitten);
                console.log("from  route /getAkitten:id, dbAKitten: ", dbAKitten);
                //console.log("dbCurrentUser.kitten.length", dbAKitten[0].kitten.length);
            })
            .catch(function(err) {
            // However, if an error occurred, send it to the client
            res.json(err);
            });
    });

    //This route gets metric document from kitten collection
    router.get("/getAMetric:id", function(req, res) {
        console.log("inside api-routes: req.params: ", req.params);
        // need to find the correct user, THEN all their kittens, 
        db.Metric.find({ _id: req.params.id})
            .then(function(dbAMetric) {
                res.json(dbAMetric);
                console.log("from  route /getAMetric:id, dbAMetric: ", dbAMetric);
            })
            .catch(function(err) {
            // However, if an error occurred, send it to the client
            res.json(err);
            });
    });


     // This route deletes the reference to the kitten document in the associated user document
    router.post("/user/removeRef/:id", function(req, res) {
        console.log("remove a kitten reference: user id: ", req.params.id);
        console.log("data transferred to remove kitten reference, req.body: ", req.body);
    // delete (or pull) the id of the kitten and pass the req.body to the entry
    db.User.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { kitten: req.body.kittenId }}, // this kitten._id should be the metric id to be removed
        { new: true }
    )
        .then(function(dbUser) {
            console.log("after .then db.User.findOneAndUpdate $pull, dbUser: ", dbUser);
            res.json(dbUser);
        })
        .catch(function(err) {
        // If an error occurred, send it to the client
            res.json(err);
        });
    });

    // This route deletes the kitten the user wants to delete
    router.delete("/kitten/delete/:id", function(req, res) {
        console.log("in kitten/delete, req.params: ", req.params);
        // delete the whole metric group
        db.Kitten.deleteOne(
            { _id: req.params.id }
        )
        .then(function(dbKitten) {
            //  
            console.log("delete a kitten, dbKitten: ", dbKitten);
            res.json(dbKitten);
        })
        .catch(function(err) {
            // but if an error occurred, send it to the client
            res.json(err);
        });
    });


    // This route deletes the reference to a metric document in the associated kitten document
    router.post("/kittens/removeRef/:id", function(req, res) {
        console.log("remove a kitten's metric reference: kitten id: ", req.params.id);
        console.log("how was data transferred, req.body: ", req.body);
    // delete the id of the metric and pass the req.body to the entry
    db.Kitten.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { metric: req.body.metricId }}, // this dbMetric._id should be the metric id to be removed
        { new: true }
    )
            .then(function(dbKitten) {
                console.log("after .then db.Kitten.findOneAndUpdate $pull, dbKitten: ", dbKitten);
                res.json(dbKitten);
            })
            .catch(function(err) {
            // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // This route deletes just one set of kitten metrics
    router.delete("/metrics/delete/:id", function(req, res) {
        console.log("in kittens/another, req.params: ", req.params);
        // delete the whole metric group
        db.Metric.deleteOne(
            { _id: req.params.id }
        )
        .then(function(dbMetric) {
            //  
            console.log("delete a Metric group, dbMetric: ", dbMetric);
            res.json(dbMetric);
        })
        .catch(function(err) {
            // but if an error occurred, send it to the client
            res.json(err);
        });
    });

    //Route to edit an individual set of metrics for a kitten
    router.post("/editMetrics/:metricID", function(req, res) {
        console.log("req.params.metricID: ", req.params.metricID);
        console.log("req.body: ", req.body);
        console.log("req.body.age: ", req.body.age);
        console.log("req.body.weight: ", req.body.weight);
        console.log("req.body.size: ", req.body.size);
        // find the intended set of metrics, and change the numbers accordingly
        db.Metric.findOneAndUpdate (
            { _id: req.params.metricID },
            {$set: { age: req.body.age , weight: req.body.weight , size: req.body.size }},
            { new: true } //send new one back
        )
            .then(function(dbMetric) {
                console.log("dbMetric: ", dbMetric);
                // If successful, send the metric and newly edited data back to the client
                res.json(dbMetric);
            })
            .catch(function(err) {
            // but if an error occurred, send it to the client
                res.json(err);
            });
    });

    //Route to edit a kitten's properties
    router.post("/editKitten/:kittenId", function(req, res) {
        console.log("req.params.kittenId: ", req.params.kittenId);
        //console.log("req.body: ", req.body);
        console.log("req.body.name: ", req.body.name);
        console.log("req.body.breed: ", req.body.breed);
        console.log("req.body.furlength: ", req.body.furlength);
        console.log("req.body.furcolor: ", req.body.furcolor);
        console.log("req.body.sex: ", req.body.sex);
        // find the intended kitten properties, and change the values accordingly
        db.Kitten.findOneAndUpdate (
            { _id: req.params.kittenId },
            {$set: { 
                name: req.body.name, 
                breed: req.body.breed, 
                furlength: req.body.furlength,
                furcolor: req.body.furcolor,
                sex: req.body.sex
            }},
            { new: true } //send new one back
        )
            .then(function(dbKitten) {
                console.log("dbKitten: ", dbKitten);
                // If successful, send the newly edited data back to the client
                res.json(dbKitten);
            })
            .catch(function(err) {
            // but if an error occurred, send it to the client
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