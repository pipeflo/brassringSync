var querystring = require('querystring')
  , http = require('http')
  , xmlreader = require('xmlreader')
  ;

module.exports = {
	getReqs: function (callback) {

		var post_data = querystring.stringify({
			'inputXml' : '<?xml version="1.0" encoding="UTF-8"?><Envelope version="01.00"><Sender><Id>16</Id><Credential>25248</Credential></Sender><TransactInfo transactType="data"><TransactId>10/24/2008</TransactId><TimeStamp>12:00:00 AM</TimeStamp></TransactInfo><Unit UnitProcessor="SearchAPI"><Packet><PacketInfo packetType="data"><packetId>1</packetId></PacketInfo><Payload><InputString><ClientId>25248</ClientId><SiteId>5404</SiteId><NumberOfJobsPerPage>30</NumberOfJobsPerPage><PageNumber>1</PageNumber><OutputXMLFormat>0</OutputXMLFormat><HotJobs /><JobDescription>YES</JobDescription><DatePosted>2016/06/01</DatePosted><outputFields /><ReturnJobsCount>30</ReturnJobsCount><SelectedSearchLocaleId /></InputString></Payload></Packet></Unit></Envelope>'
		});

		var options = {
			hostname: 'import.brassring.com',
  			port: 80,
  			path: '/WebRouter/WebRouter.asmx/route',
  			method: 'POST',
  			headers: {
  				'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
  				, 'Content-Length': Buffer.byteLength(post_data)
  			}
		};

		var req = http.request(options, function(respuesta) {
			
			var body = '';
		  	respuesta.on('data', (d) => {
		    	body += d;
		  	}).on('end', function(){
	  			xmlreader.read(body, function (errXmlreader, result){
	  				if(!errXmlreader){
	  					xmlreader.read(result.string.text(), function(errReadReqsXml, reqs){
	  						if (!errReadReqsXml){
								//console.log("Jobs:::", reqs.Envelope.Unit.Packet.Payload.ResultSet.Jobs.Job.count());
	  							callback(null, reqs.Envelope.Unit.Packet.Payload.ResultSet.Jobs);
							} else {
								console.status(500).json(errReadReqsXml);
							}
	  					});
	  				} else {
	  					console.error("Error reading Brassring XML Body to get Jobs list ", errXmlreader);
	  					callback({
			  				"status" : 500,
			  				"message" : "Error reading Brassring XML Body to get Jobs list " + errXmlreader
			  			}, null);
	  				}
	  			});
		  	});
		});
		req.write(post_data);
		req.end();

		req.on('error', (e) => {
			console.error("Error getting Brassring reqs with POST: ", e);
		  	callback({
		  		"status": 500,
	        	"message": "Error getting Brassring reqs with POST: " + e
	        }, null);
		});
	}
}