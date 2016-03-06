'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MapFile = new Schema({
	'file': String,
	'city': String,
	'country': String,
	'comment': String
});

exports.MapFile = db.model('MapFile', MapFile);