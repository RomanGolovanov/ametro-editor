'use strict';

var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	settings = require('./settings.js'),
	connection = require('./connection.js'),
	MapFile = require('./schemes.js').MapFile;

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/api', function (req, res, next) {
	res.send({ ver: '1.0', available: connection.isConnected(), timestamp: new Date()});
});

app.get('/api/maps', function (req, res, next) {
	if(!connection.isConnected()){
		throw "Api not available";
	}
	MapFile.find().exec(function(err, docs) {
		if (err) return next(err);
		res.send(docs.map(function(d){ return d.json(); }));
	});
});

app.post('/api/maps', function (req, res, next) {
	console.log(req.body);
	if(!connection.isConnected()){
		throw "Api not available";
	}
	MapFile.create(req.body, function(err, docs) {
		if (err) return next(err);
		res.send(docs);
	});
});

app.listen(settings.port, settings.host, function () {
	console.log('Backend service listening on port ' + settings.port);
});

