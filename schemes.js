'use strict';

var mongoose = require('mongoose'),
	db = require('./connection.js').db,
    Schema = mongoose.Schema;

var MapFile = new Schema({
	'file': String,
	'city': String,
	'country': String,
	'comment': String
});

MapFile.methods.json = function json (cb) {
	return {  	
		id: this._id,
		file: this.file,
		city: this.city,
		country: this.country,
		comment: this.comment
	};
};

module.exports.MapFile = db.model('MapFile', MapFile);