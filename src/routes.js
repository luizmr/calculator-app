module.exports = function (app) {
	var arithmetic = require("./calculations/calc");

	app.route("/arithmetic").get(arithmetic.calculate);
};
