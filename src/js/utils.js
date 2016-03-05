'use strict';

if (!Array.prototype.remove) {
  Array.prototype.remove = function(element) {

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var index = this.indexOf(element);
    if(index===-1){
      throw new TypeError();
    }

    this.splice(index,1);

    return element;
  };
}

var Utils = (function(){
  return {
    dataURLToBlob: function(dataURL) {
        var BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1) {
            var parts = dataURL.split(',');
            var contentType = parts[0].split(':')[1];
            var raw = decodeURIComponent(parts[1]);
            return new Blob([raw], {type: contentType});
        }
        var parts = dataURL.split(BASE64_MARKER);
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;
        var uInt8Array = new Uint8Array(rawLength);
        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], {type: contentType});
    },

    formatIniText: function(ini){
        var lines = [];
        Object.keys(ini).forEach(function(sectionKey){
            lines.push('[' + sectionKey + ']');
            Object.keys(ini[sectionKey]).forEach(function(valueKey){
                var value = ini[sectionKey][valueKey];
                if(value instanceof Array){
                    for(var i=0;i<value.length;i++){
                    lines.push(valueKey + '=' + value[i]);
                    }
                }else{
                    lines.push(valueKey + '=' + value);
                }
            });
        });
        return lines.reduce(function(a,c){ return a+'\n'+c; });
    },

    parseIniText: function(text){
        var regex = {
            section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
            param: /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/,
            comment: /^\s*;.*$/
        };
        var value = {};
        var lines = text.split(/\r\n|\r|\n/);
        var section = null;
        lines.forEach(function(line){
            if(regex.comment.test(line)){
                return;
            }else if(regex.param.test(line)){
                var match = line.match(regex.param);
                if(section){
                    var currentValue = value[section][match[1]];
                    if(!currentValue){
                        value[section][match[1]] = match[2];
                    }else{
                        if(typeof(currentValue)==='string'){
                            value[section][match[1]] = [currentValue, match[2]];
                        }else{
                            value[section][match[1]].push(match[2]);
                        }
                    }



                }else{
                    value[match[1]] = match[2];
                }
            }else if(regex.section.test(line)){
                var match = line.match(regex.section);
                value[match[1]] = {};
                section = match[1];
            }else if(line.length == 0 && section){
                section = null;
            };
        });
        return value;
    }

  }
})();

