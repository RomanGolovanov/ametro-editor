'use strict';

function PmzPoint(x,y){
	this.x = x;
	this.y = y;
	return this;
}

PmzPoint.prototype.isEmpty = function(){
	return this.x === 0 && this.y === 0;
};

function PmzRect(x,y,width,height){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	return this;
}

PmzRect.prototype.isEmpty = function(){
	return this.x === 0 && this.y === 0 && this.width === 0 && this.height === 0;
};

function PmzTime(minutes, seconds){
	this.minutes = minutes;
	this.seconds = seconds;
	return this;
}


