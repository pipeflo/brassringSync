var querystring = require('querystring')
  , http = require('http')
  ;

module.exports = {
	createJob: function (job, callback) {

		var post_data = JSON.stringify(job);

		console.log("Job enviado a rabajando: ", post_data);

		var options = {
			hostname: 'services.demotbj.com',
  			port: 80,
  			path: '/jobs-v1.4/rest/json',
  			method: 'POST',
  			headers: {
  				'Content-Type': 'application/json'
  				, 'Content-Length': Buffer.byteLength(post_data)
  			}
		};

		var req = http.request(options, function(respuesta) {
			var body = '';
		  	respuesta.on('data', (d) => {
		    	body += d;
		  	}).on('end', function(){
		  		if (respuesta.statusCode == 200) {
			        callback(null, JSON.parse(body));
			        return;
		  		} else {
		  			console.error("Error creating Job in Trabajando.com in post status message: status message: ", respuesta.statusMessage, " -- body: ", body);
		  			callback({
				  		"status": 500,
			        	"message": "Error creating Job in Trabajando.com in post status message: status message: " + respuesta.statusMessage + " -- body: " + body
			        }, null);
				 }
	  			
		  	});
		});
		req.write(post_data);
		req.end();

		req.on('error', (e) => {
			console.error("Error creating Job in Trabajando.com with POST: ", e);
		  	callback({
		  		"status": 500,
	        	"message": "Error creating Job in Trabajando.com with POST: " + e
	        }, null);
		});
	}
	, updateJob: function (job, callback) {


		var post_data = JSON.stringify(job);

		var options = {
			hostname: 'services.demotbj.com',
  			port: 80,
  			path: '/jobs-v1.4/rest/json',
  			method: 'PUT',
  			headers: {
  				'Content-Type': 'application/json'
  				, 'Content-Length': Buffer.byteLength(post_data)
  			}
		};

		var req = http.request(options, function(respuesta) {
			var body = '';
		  	respuesta.on('data', (d) => {
		    	body += d;
		  	}).on('end', function(){
		  		if (respuesta.statusCode == 200) {
			        callback(null, JSON.parse(body));
			        return;
		  		} else {
		  			console.error("Error updating Job in Trabajando.com in PUT status message: status message: ", respuesta.statusMessage, " -- body: ", body);
		  			callback({
				  		"status": 500,
			        	"message": "Error updating Job in Trabajando.com in PUT status message: status message: " + respuesta.statusMessage + " -- body: " + body
			        }, null);
				 }
	  			
		  	});
		});
		req.write(post_data);
		req.end();

		req.on('error', (e) => {
			console.error("Error updating Job in Trabajando.com with PUT: ", e);
		  	callback({
		  		"status": 500,
	        	"message": "Error updating Job in Trabajando.com with PUT: " + e
	        }, null);
		});
	}
}