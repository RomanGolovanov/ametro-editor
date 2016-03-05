'use strict';

function PmzPoint(x,y){
	var self = this;
	
	this.x = x;
	this.y = y;

	this.isEmpty = function(){
		return self.x === 0 && self.y === 0;
	}

	return this;
}

function PmzRect(x,y,width,height){
	var self = this;

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.isEmpty = function(){
		return self.x === 0 && self.y === 0 && self.width === 0 && self.height === 0;
	}

	return this;
}

function PmzAdditionNodes(line, src, dst, points, isSpline){
	var self = this;

	this.line = line;
	this.src = src;
	this.dst = dst;
	this.points = points;
	this.isSpline = isSpline;

	return this;
}

function PmzTime(minutes, seconds){
	var self = this;
	
	this.minutes = minutes;
	this.seconds = seconds;

	return this;
}

function PmzModel(metadata, transports, schemes){
	var self = this;

	this.metadata = metadata;
	this.transports = transports;
	this.schemes = schemes;

	return this;
}

function PmzTransport(id, name, options, lines, transfers){
	var self = this;

	this.id = id;
	this.name = name;
	this.options = options;
	this.lines = lines;
	this.transfers = transfers;

	return this;
}

function PmzScheme(id, name, options, lines){
	var self = this;

	this.id = id;
	this.name = name;
	this.options = options;
	this.lines = lines;

	return this;
}

function PmzSchemeLine(id, name, color, labelColor, labelBackgroundColor, coords, rects, heights, rect, rects2, nodes, visible){
	var self = this;

	this.id = id;
	this.name = name;

	this.color = color;
	this.labelColor = labelColor;
	this.labelBackgroundColor = labelBackgroundColor;
	this.coords = coords || [];
	this.rects = rects || [];
	this.heights = heights || [];
	this.rect = rect;
	this.rects2 = rects2 || [];
	this.nodes = nodes || [];
	this.visible = visible;

	return this;
}

function PmzMetadata(name, cityName, countryName, version, comments, delays){
	var self = this;

	this.name = name;
	this.cityName = cityName;
	this.countryName = countryName;
	this.version = version;
	this.comments = comments;
	this.delays = delays;

	return this;
}

