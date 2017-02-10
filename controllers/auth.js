var https = require('https')
	, config = require('../config/config')
	, jwt = require('jsonwebtoken')
	;

module.exports = {
	auth: function (req, res) {

		var authTokenBase64 = req.body.code || req.headers['loginToken'];

		var options = {
			hostname: 'apps.na.collabserv.com',
  			port: 443,
  			path: '/connections/opensocial/basic/rest/people/@me/@self',
  			method: 'GET',
  			headers: { 'Authorization': 'Basic ' + authTokenBase64 }
		};

		var req = https.request(options, function(response) {
			var body = '';
		  	response.on('data', (d) => {
		    	body += d;
		  	}).on('end', function(){
		  		if (response.statusCode == 200) {
		  			console.log("Datos usuario:", body);
		  			var userData = JSON.parse(body);
		  			userData.tokenBase64 = authTokenBase64;
		            
		            var token = jwt.sign(userData, config.secret, {
		                expiresIn: '2h' // expires in 2 hours
		            });
		  			res.status(200).json({
		  				"userData": userData,
		  				"token": token
		  			});
			        return;
		  		} else {
		  			res.status(response.statusCode).json({
		  				"status": response.statusCode,
		  				"message": "User not found"
		  			});
			        return;
		  		}
		  	});
		});
		req.end();

		req.on('error', (e) => {
			console.error(e);
		  	res.status(500).json({
		  		"status" : 500,
	        	"message": "Error trying to login: " + e
	        });
		});
	}
}