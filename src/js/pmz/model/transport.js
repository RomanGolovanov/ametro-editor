'use strict';

function PmzTransport(id, name, options, lines, transfers){
	this.id = id;
	this.name = name;
	this.options = options;
	this.lines = lines;
	this.transfers = transfers;
	return this;
}

