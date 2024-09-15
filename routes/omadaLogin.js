var express = require('express');
var router = express.Router();


module.exports = function(config) {

	router.get('/', async function(req, res, next) {
        console.log('omadaLogin');
		res.render('success', { title: config.title });
	});
	return router;
}