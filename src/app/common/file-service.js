(function () {
    'use strict';

    angular
        .module('aMetroEditor')
        .factory('FileService', function(){

            function detectMimeType(name, mime){
                if(mime) return mime;
                if(name.toLowerCase().endsWith('.pmz')){
                    return 'application/zip';
                }
                throw new TypeError('Unsupported type of file ' + name);
            }

            function onFileChange(ev, readyCallback, errorCallback){
                try{
                    var fileControl = ev.target.files[0];
                    var reader = new FileReader();
                    reader.onload = function(event){
                        try{
                            readyCallback({ 
                                name: fileControl.name, 
                                type: detectMimeType(fileControl.name, fileControl.type), 
                                content: event.target.result 
                            });
                        }catch(error){
                            errorCallback(error);
                        }
                    };
                    reader.onerror = function(error){
                        errorCallback(error);
                    };
                    reader.readAsArrayBuffer(fileControl);
                }catch(error){
                    errorCallback(error);
                }
            }

            return {
                openFile: function(readyCallback, errorCallback){
                    var fileElement = document.createElement('input');
                    fileElement.type = 'file';
                    fileElement.style.display = 'none';
                    angular.element(fileElement).on('change', function(ev){
                        onFileChange(ev, 
                            function(file){
                                try{
                                    if(readyCallback) readyCallback(file);
                                }catch(error){
                                    if(errorCallback) errorCallback(error);
                                }
                            },
                            function(error){
                                if(errorCallback) errorCallback(error);
                            });
                    });
                    $(fileElement).click();
                },

                saveFile: function(file){
                    saveAs(new Blob([file.content]), file.name);
                },

                unzipFiles: function(file){
                    var validTypes = ['application/x-zip-compressed', 'application/zip']
                    if(validTypes.indexOf(file.type)==-1){
                        throw new TypeError('Invalid file type ' + file.type + ' for unzipping');
                    }

                    var files = [];

                    var zip = new JSZip(file.content);
                    for(var entryName in zip.files){
                        var zipEntry = zip.files[entryName];
                        files.push({
                            name: zipEntry.name,
                            textContent: zipEntry.asText()
                        });
                    }
                    return files;
                },

                zipFiles: function(files){
                    var zip = new JSZip();

                    for(var file in files){

                        zip.file(files[file].name, files[file].textContent);
                    }
                    return zip.generate({type:'arraybuffer'});
                }

            };

        })
})();
