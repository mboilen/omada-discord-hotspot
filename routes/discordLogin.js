var express = require('express');
var router = express.Router();
var { request } = require('undici');
module.exports = function(config) {

	/* GET home page. */
	router.get('/', async function(req, res, next) {
		const { code } = req.query;

		try {
			const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams({
					client_id: config.discord.clientId,
					client_secret: config.discord.clientSecret,
					code,
					grant_type: 'authorization_code',
					redirect_uri: config.urls.discordLogin,
					scope: 'identify',
				}).toString(),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});

			const oauthData = await tokenResponseData.body.json();

			const guildsResult = await request('https://discord.com/api/users/@me/guilds', {
				headers: {
					authorization: `${oauthData.token_type} ${oauthData.access_token}`,
				},
			});

			const guildList = await guildsResult.body.json();

			if (guildList.find((elt) => {
				console.log(elt.id);
				return config.discord.allowedGuilds.includes(elt.id)
			})) {
				res.render( 'loggingin', { target: config.urls.login} );
			} else {
				res.render( 'denied', { title: config.title } );
			}

		} catch (error) {
			// NOTE: An unauthorized token will not throw an error
			// tokenResponseData.statusCode will be 401
			res.render('error', { error: error} );
		}
	});

	return router;
}