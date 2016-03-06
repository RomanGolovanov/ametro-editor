'use strict';

var mongoose = require('mongoose'),
	settings = require('./settings.js');


var isConnected;
var db = mongoose.createConnection(settings.database);

db.on('error', function(err){
 	console.error('DB connection error:', err);	
 	isConnected = false;
});

db.once('open', function() {
	console.log('DB connection OK');
	isConnected = true;
});

module.exports.db = db;

module.exports.isConnected = function(){
	return db.readyState === 1;
};