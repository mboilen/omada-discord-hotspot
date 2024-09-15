var express = require('express');
var router = express.Router();


module.exports = function(config) {

	router.get('/', async function(req, res, next) {
        if (req.session.authenticated) {
            console.log('omadaLogin');
            res.render('success', { title: config.title });
        } else {
            console.error('login page hit by unauthenticated user');
            res.render('denied', { title: config.title });
        }
	});
	return router;
}