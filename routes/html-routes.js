
// Include the path package

var path = require("path");

// need routes for home(/), topic(/topic), metrics(/metrics), login(/login)?
module.exports = function(app) {

	app.get("/topic", function(req, res) {
		res.sendFile(path.join(__dirname, "../public/topic.html"));
	});

	app.get("/", function(req, res) {
		res.sendFile(path.join(__dirname, "../public/home.html"));
    });
    
    app.get("/metric", function(req, res) {
		res.sendFile(path.join(__dirname, "../public/metric.html"));
    });
    
    app.get("/login", function(req, res) {
		res.sendFile(path.join(__dirname, "../public/login.html"));
	});

};

