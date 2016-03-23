'use strict';

function PmzModel(metadata, transports, schemes){
	this.metadata = metadata;
	this.transports = transports;
	this.schemes = schemes;
	return this;
}


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

PmzModel.prototype.addTransport = function(name, type){
	this.transports[name] = new PmzTransport(name, name, { type: type }, {}, {});
};

PmzModel.prototype.removeTransport = function(name){
	delete this.transports[name];
};

PmzModel.prototype.getTransport = function(name){
	return this.transports[name];
};