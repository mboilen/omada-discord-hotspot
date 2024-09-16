var express = require('express');
var router = express.Router();
var { request, getSetCookies } = require('undici');


module.exports = function(config) {

	router.get('/', async function(req, res, next) {
        body = JSON.stringify({name: config.omada.username, password: config.omada.password});
        if (req.session.authenticated) {
			const omadaOperatorLogin = await request(config.urls.omadaApiLoginUrl, {
				method: 'POST',
				body: body,
				headers: {
					'Content-Type': 'application/json',
				},
                rejectUnauthorized: false
			});

			const oauthData = await omadaOperatorLogin.body.json();

            const headers = omadaOperatorLogin.headers;
            //extract csrf-token
            const token = oauthData.result.token
            const setCookie = headers['set-cookie']
            
            body = JSON.stringify({
                'clientMac': req.session.omada.clientMac,
                'apMac': req.session.omada.apMac,
                'ssidName': req.session.omada.ssidName,
                'radioId': req.session.omada.radioId,
                'site': req.session.omada.site,
                //Default to 24 hours (make configurable)
                'time': 24*60*60*1000, //value is in ms
                'authType': 4
            });
            const clientAuthResponse = await request(config.urls.omadaClientAuthUrl, {
                method: 'POST',
                body: body,
                headers: {
					'Content-Type': 'application/json',
                    'Csrf-Token': token,
                    'Cookie': setCookie
                },
                rejectUnauthorized: false
            });
			const clientAuthData = await clientAuthResponse.body.json();

            res.render('success', { title: config.title });
        } else {
            console.error('login page hit by unauthenticated user');
            res.render('denied', { title: config.title });
        }
	});
	return router;
}