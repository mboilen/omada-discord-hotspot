var express = require('express');
var router = express.Router();


module.exports = function(config) {
	//Compose the response url:
	responseUrl = "https://discord.com/oauth2/authorize?client_id=" + config.discord.clientId + "&response_type=code&redirect_uri=" + encodeURIComponent(config.urls.discordLogin) + "&scope=identify+guilds";

	router.get('/', async function(req, res, next) {

		//Check for tplink omada parameters
		req.session.omada = {};
		req.session.omada.clientMac = req.query.clientMac;
		req.session.omada.clientIp = req.query.clientIp;
		req.session.omada.t = req.query.t;
		req.session.omada.redirectUrl = req.query.redirectUrl;
		req.session.omada.apMac = req.query.apMac;
		req.session.omada.ssidName = req.query.ssidName;
		req.session.omada.radioId = req.query.radioId;
		req.session.omada.site = req.query.site

		res.render('index', { title: config.title,
			                  postUrl: responseUrl
		                    }
				)
	});
	return router;
}