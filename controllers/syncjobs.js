var https = require('https')
	, xmlreader = require('xmlreader')
	, brassring = require('./brassring')
	, trabajando = require('./trabajando')
	, syncdb = require('./syncdb')
	, Job = require('../schema/job')
	, config = require('../config/config')
	, Cloudant = require('cloudant')
	, https = require('https')
	;

module.exports = {
	syncJobs: function (req, res) {
		//Create Sync Request ID
		syncdb.startSyncRequest(function(error, syncRequest){
			if (!error){
				//After SyncRequest ID created, get Brassring Reqs
				brassring.getReqs(function(errGetReqs, reqs){
					if (!errGetReqs){
						var results = {
							new : 0,
							updated: 0,
							ignored : 0,
							total : 0
						}
						reqs.Job.each(function(i, brassringReq){
							syncdb.validateRecord(brassringReq.Question.at(1).text(), function(errValidating, syncrecord){
								if (!errValidating){
									var job = new Job();
									job.description.jobTitle = brassringReq.Question.at(2).text();
									job.description.jobDescription = brassringReq.JobDescription.text();
									if (!syncrecord){
										trabajando.createJob(job, function(errorTrabajandoCreateJob, respuesta){
											if (!errorTrabajandoCreateJob){
												syncdb.insertSyncRecord(brassringReq.Question.at(1).text(), respuesta.data.id, syncRequest.id, brassringReq.Question.at(2).text(), function(errorInsertSyncRecord, result){
													if (!errorInsertSyncRecord){
														results.new++;
														results.total++;
														if (results.total == reqs.Job.count()){
															syncdb.closeSyncRequest(syncRequest, results, function(errorClosingSyncRequest, result){});
															res.status(200).json(results);
															return;
														}
													} else {
														res.status(500).json(errorInsertSyncRecord);
													}
												});
											} else {
												res.status(500).json(errorTrabajandoCreateJob);
											}
										});
									} else {
										var recordLastUpdated = new Date(syncrecord.lastUpdate);
										recordLastUpdated.setHours(0,0,0,0);

										var brassringLastUpdated = new Date(brassringReq.LastUpdated.text());

										if (recordLastUpdated <= brassringLastUpdated){
											job.jobId = syncrecord.idTrabajando;
											trabajando.updateJob(job, function(errorTrabajandoUpdateJob, respuesta){
												if (!errorTrabajandoUpdateJob){
													syncdb.updateSyncRecord(syncrecord, syncRequest.id, function(errorUpdateSyncRecord, result){
														if (!errorUpdateSyncRecord){
															results.updated++;
															results.total++;
															if (results.total == reqs.Job.count()){
																syncdb.closeSyncRequest(syncRequest, results, function(errorClosingSyncRequest, result){});
																res.status(200).json(results);
																return;
															}
														} else {
															res.status(500).json(errorUpdateSyncRecord);
														}
													});
												} else {
													res.status(500).json(errorTrabajandoUpdateJob);
												}
											});
										} else {
											results.ignored++;
											results.total++;
											if (results.total == reqs.Job.count()){
												syncdb.closeSyncRequest(syncRequest, results, function(errorClosingSyncRequest, result){});
												res.status(200).json(results);
												return;
											}
										}
									}
								} else {
									res.status(500).json(errValidating);
								}
							});
						});
					} else {
						res.status(500).json(errGetReqs);
					}
				});
			} else {
				res.status(500).json(error);
			}
		});
	}
	, testTrabajando: function (req, res) {
		trabajando.createJob(job, function(error, respuesta){
			if (!error){
				res.status(200).json(respuesta);
			} else {
				res.status(500).json(error);
			}
		});
	}
}