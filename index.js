'use strict';

var express = require('express'),
	app = express(),
	settings = require('./settings.js').settings,
	connection = require('./connection.js'),
	MapFile = require('./schemes.js').MapFile;

app.use(express.static('public'));

app.get('/api', function (req, res, next) {
	res.send({ ver: '1.0', available: connection.isConnected(), timestamp: new Date()});
});

app.get('/api/maps', function (req, res, next) {
	if(!connection.isConnected()){
		throw "Api not available";
	}
	MapFile.find(function(err, docs) {
		if (err) return next(err);
		res.send(docs);
	});
});

app.listen(settings.port, settings.host, function () {
	console.log('Backend service listening on port ' + settings.port);
});
