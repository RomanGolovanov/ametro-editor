'use strict';

function PmzMetadata(name, cityName, countryName, version, description, comment, delays){
	var self = this;

	this.name = name;
	this.cityName = cityName;
	this.countryName = countryName;
	this.version = version;
	this.description = description;
	this.comment = comment;
	this.delays = delays;

	return this;
}

