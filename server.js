var express = require("express"),
	app = express(),
	port = process.env.PORT || 3000;

// app.use(express.static(__dirname + "public"));
// app.use(express.static(__dirname + "/src"));

var routes = require("./src/routes");
routes(app);

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/public/index.html");
});

// app.use(app.router);

app.listen(port);

// module.exports = app;

console.log("Server running on port " + port);
