var express = require('express');
var router = express.Router();


module.exports = function(config) {
	//Compose the response url:
	responseUrl = "https://discord.com/oauth2/authorize?client_id=" + config.discord.clientId + "&response_type=code&redirect_uri=" + encodeURIComponent(config.urls.discordLogin) + "&scope=identify+guilds";

	router.get('/', async function(req, res, next) {
		res.render('index', { title: config.title,
			                  postUrl: responseUrl
		                    }
				)
	});
	return router;
}