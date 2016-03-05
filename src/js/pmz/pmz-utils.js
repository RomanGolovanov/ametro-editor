

var PmzUtils = (function(){
    'use strict';

    function asInt(text){
    	return text && text!=='?' ? parseInt(text) : null;
    }

	function asArray(text){
		if(!text) return [];
		return text.split(',').map(function(item){ 
			return item === '?' ? null : item; 
		});
	}

    function asIntArray(text){
		return asArray(text).map(function(item){ 
			if(!item) return null;
			return parseInt(item); 
		});
	}

	function asFloatArray(text){
		return asArray(text).map(function(item){ 
			if(!item) return null;
			return parseFloat(item); 
		});
	}

    return {
        constants: {
            DEFAULT_MAP_NAME: 'Metro.map',
            DEFAULT_TRP_NAME: 'Metro.trp',
            DEFAULT_LINE_COLOR: 'black'
        },

    	asArray: asArray,
    	asIntArray: asIntArray,
    	asFloatArray: asFloatArray,

    	asPmzPointArray: function(text){
    		var values = asIntArray(text);
    		var points = [];
    		for(var i =0; i<(values.length-1); i+=2){
    			points.push(new PmzPoint(values[i],values[i+1]));
    		}
    		return points;
    	},

    	asPmzRectArray: function(text){
    		var values = asIntArray(text);
    		var rects = [];
    		for(var i =0; i<(values.length-3); i+=2){
    			rects.push(new PmzRect(values[i],values[i+1],values[i+2],values[i+3]));
    		}
    		return rects;
    	},

    	asPmzPoint: function(text){
    		var values = asIntArray(text);
    		return new PmzPoint(values[0],values[1]);
    	},

    	asPmzRect: function(text){
    		var values = asIntArray(text);
    		return new PmzRect(values[0],values[1],values[2],values[3]);
    	},

    	asAdditionalNodes: function(text){
            var parts = asArray(text);

            var line = parts[0];
            var src = parts[1];
            var dst = parts[2];
            var isSpline = parts.length % 2 === 0;
            var points = [];
            for(var i=3;i<(parts.length-1); i+=2){
            	points.push(new PmzPoint(parseInt(parts[i]), parseInt(parts[i+1])));
            }
    		return new PmzAdditionNodes(line, src, dst, points, isSpline);
    	},

    	asPmzTime: function(text){
    		if(!text || !text.length){
    			return null;
    		}
    		var parts = text.split('.');
    		return new PmzTime(asInt(parts[0]), 
    			parts.length === 2 ? asInt(parts[1]) : null);
    	},

        asColor: function(text){
            if(!text || !text.length){
                return null;
            }
            return '#' + text;
        },

        decodeWindows1251 : function (buffer){
            var byteString = '';
            buffer.forEach(function(b){ 
                byteString = byteString + String.fromCharCode(b); 
            });
            return windows1251.decode(byteString, { 'mode': 'fatal' });
        },

        encodeWindows1251 : function (text){
            var asciiEncodedText = windows1251.encode(text);
            var buffer = new Uint8Array(asciiEncodedText.length);
            for(var i=0;i<asciiEncodedText.length;i++){
                buffer[i] = asciiEncodedText.charCodeAt(i);
            }
            return buffer;
        }

    };
})();