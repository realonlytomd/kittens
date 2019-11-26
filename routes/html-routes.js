
// Include the path package

var path = require("path");

// need routes for index(/), topic(/topic), metric(/metric), login(/login)?
module.exports = function(app) {

	app.get("/topic", function(req, res) {
		res.sendFile(path.join(__dirname, "../public/topic.html"));
	});

	app.get("/", function(req, res) {
		res.sendFile(path.join(__dirname, "../public/index.html"));
    });
    
    app.get("/metric", function(req, res) {
		res.sendFile(path.join(__dirname, "../public/metric.html"));
    });
    
    app.get("/login", function(req, res) {
		res.sendFile(path.join(__dirname, "../public/login.html"));
	});

};

