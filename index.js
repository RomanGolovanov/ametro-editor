'use strict';

var mongoose = require('mongoose'),
	nconf = require('nconf');

nconf.env().argv().file({ file: 'config.json' });

global.settings = {
	port: nconf.get('PORT') || 3000,
	host: nconf.get('HOST') || '127.0.0.1',
	database: nconf.get('database') || 'mongodb://localhost/ametro-editor'
};

global.db = mongoose.createConnection(settings.database);
db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', function() { console.log('DB connection OK'); });

var express = require('express'),
	models = require('./schemes.js'),
	MapFile = models.MapFile,	
	app = express();

app.use(express.static('public'));

app.get('/api', function (req, res, next) {
	res.send({ ver: '1.0', timestamp: new Date()});
});

app.get('/api/maps', function (req, res, next) {
	MapFile.find(function(err, docs) {
		if (err) return next(err);
		res.send(docs);
	});
});

app.listen(settings.port, settings.host, function () {
	console.log('Backend service listening on port ' + settings.port);
});

