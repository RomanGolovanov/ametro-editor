
var PmzFile = (function(){
    'use strict';

    function enumerateEntries(zip, ext, callback){
        for(var entryName in zip.files){
            var zipEntry = zip.files[entryName];
            if(entryName.endsWith(ext)){
                if(callback(entryName, zipEntry)){
                    return;
                }
            }
        }        
    }

    function enumerateIniEntries(zip, ext, callback){
        enumerateEntries(zip, ext, function(name, entry){
            return callback(name, Utils.parseIniText(
                PmzUtils.decodeWindows1251(entry.asUint8Array())));
        });
    }

    function openZip(file){
        if(['application/x-zip-compressed', 'application/zip'].indexOf(file.type)==-1){
            throw new TypeError('Invalid file type ' + file.type + ' for PMZ map');
        }
        var zip = new JSZip(file.content);
        enumerateEntries(zip, '.pmz', function(name, entry){ 
            zip = new JSZip(entry.asArrayBuffer()); 
            return true;
        });
        return zip;
    }

    return {
        create : function(){
            var metadata = new PmzMetadata('Unknown', null, null, '1.0.0');
            var transports = { 'Metro.trp': new PmzTransport('Metro.trp', 'Metro.trp', {}) };
            var schemes = { 'Metro.map': new PmzScheme('Metro.map', 'Metro.map', {}, {}) };

            return new PmzModel(metadata, transports, schemes);
        },     

        load: function(file){

            var zip = openZip(file);

            var metadata;
            enumerateIniEntries(zip, '.cty', function(name, ini){
                metadata = PmzMetadataFile.load(ini);
            });

            if(!metadata){
                throw new TypeError('Invalid file format');
            }

            var transports = {};
            enumerateIniEntries(zip, '.trp', function(name, ini){
                var transport = PmzTransportFile.load(ini, name, metadata);
                transports[transport.id] = transport;
            });

            var schemes = {};
            enumerateIniEntries(zip, '.map', function(name, ini){
                var scheme = PmzSchemeFile.load(ini, name, metadata, transports);
                schemes[scheme.id] = scheme;
            });

            return new PmzModel(metadata, transports, schemes);
        },

        save: function(file, model){
            var zip = openZip(file);
            
            var metaIni = PmzMetadataFile.save(model.metadata);
            var metaText = Utils.formatIniText(metaIni);
            var metaEncoded = PmzUtils.encodeWindows1251(metaText);
            zip.file(model.metadata.name + '.cty', metaEncoded);

            file.content = zip.generate({type:'arraybuffer'});
        }
    };

})();
