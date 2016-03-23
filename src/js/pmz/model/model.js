'use strict';

function PmzModel(metadata){
	this.metadata = metadata;
	this.transports = {};
	this.schemes = {};
	return this;
}


PmzModel.create = function(){
	var model = new PmzModel(new PmzMetadata('Unknown', null, null, '1.0.0'));
	model.addTransport('Metro.trp', 'Метро');
	model.addScheme('Metro.map');
	return model;
};


PmzModel.prototype.getMetadata = function(){
	return this.metadata;
};


PmzModel.prototype.getSchemes = function(){
	return Object.keys(this.schemes);
};

PmzModel.prototype.addScheme = function(name, options, lines){
	this.schemes[name] = new PmzScheme(name, name, options || {}, lines || {});
};

PmzModel.prototype.removeScheme = function(name){
	delete this.schemes[name];
};

PmzModel.prototype.getScheme = function(name){
	return this.schemes[name];
};


PmzModel.prototype.getTransports = function(){
	return Object.keys(this.transports);
};

PmzModel.prototype.addTransport = function(name, type, lines, transfers){
	this.transports[name] = new PmzTransport(name, name, { type: type }, lines || {}, transfers || {});
};

PmzModel.prototype.removeTransport = function(name){
	delete this.transports[name];
};

PmzModel.prototype.getTransport = function(name){
	return this.transports[name];
};