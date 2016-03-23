var PmzModelFile = (function(){
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
        load: function(file){

            var zip = openZip(file);

            var model = null;
            enumerateIniEntries(zip, '.cty', function(name, ini){
                model = new PmzModel(PmzMetadataFile.load(ini));
            });

            if(!model){
                throw new TypeError('Invalid file format');
            }

            enumerateIniEntries(zip, '.trp', function(name, ini){
                var transport = PmzTransportFile.load(ini, name, model.getMetadata());
                model.addTransport(transport.name, transport.options, transport.lines, transport.transfers);
            });

            enumerateIniEntries(zip, '.map', function(name, ini){
                var scheme = PmzSchemeFile.load(ini, name, model);
                model.addScheme(scheme.name, scheme.options, scheme.lines);
            });

            return model;
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
