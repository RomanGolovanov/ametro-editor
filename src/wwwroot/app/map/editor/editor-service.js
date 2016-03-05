(function () {
    'use strict';

    angular
        .module('aMetroEditor')
        .factory('EditorService', function($rootScope,$timeout){
            var container = document.createElement('div');
            var canvasElement = document.createElement('canvas');
            var imageElement = document.createElement('img');

            container.style.display = 'none';
            imageElement.style.display = 'none';
            imageElement.id = 'editorImage';

            var editor = new EditorModel(canvasElement, imageElement, {
                onSelectionChanged: function () {
                    $rootScope.$apply(function(){
                        var selection = editor.getSelectedStations();
                        $rootScope.$emit('editor', { name: 'selection',  selection: selection });
                    });
                },
                onBackgroundLoaded: function(){
                    $rootScope.$apply(function(){
                    	$rootScope.$emit('editor', { name: 'ready' }); 
                    });
                }
            });

            $rootScope.$on('model', function(event,data){
                editor.setDataModel(data);
                $rootScope.$emit('editor', { name: 'schemes', action: 'select', scheme: editor.getCurrentScheme() });
                $rootScope.$emit('editor', { name: 'lines', action: 'select', line: editor.getCurrentLine() });

            });

            var service = {
                attach: function(element){
                    element.appendChild(canvasElement);
                    $rootScope.$emit('editor', { name: 'attach' });
                    service.loadBackground('img/data/map2.jpg');
                },

                resize: function(width, height){
                    editor.setEditorSize(width, height);
                },

                detach: function(){
                    container.appendChild(canvasElement);
                    $rootScope.$emit('editor', { name: 'detach' });
                },

                getSelectedStations: function(){
                    return editor.getSelectedStations();
                },

                connectSelection: function(){
                    return editor.connectStations(editor.getSelectedStations());
                },

                deleteSelection: function(){
                    return editor.deleteStations(editor.getSelectedStations());
                },

                loadBackground: function(url){
                    editor.setBackgroundAsync(url);
                    $rootScope.$emit('editor', { name: 'loading' });
                },


                getLines: function(){
                    var defaultScheme = editor.getSchemes()[PmzUtils.constants.DEFAULT_MAP_NAME];

                    var lines = [];
                    var dict = editor.getLines();
                    for(var key in dict){
                        var line = dict[key];
                        if(!line.coords || line.coords.length === 0){
                            continue;
                        }

                        var defaultLineColor = defaultScheme && defaultScheme.lines[key] 
                            ? defaultScheme.lines[key].color 
                            : PmzUtils.constants.DEFAULT_LINE_COLOR;


                        lines.push({
                            id: line.id,
                            name: line.name,
                            color: line.color,
                            defaultColor: defaultLineColor
                        });
                    }
                    return lines;
                },

                setCurrentLineId: function(id){
                    var line = editor.getLines()[id];
                    if(line){
                        editor.setCurrentLine(line);
                    }else{
                        editor.setCurrentLine(null);
                    }
                    $rootScope.$emit('editor', { name: 'lines', action: 'select', line: editor.getCurrentLine() });
                },

                getCurrentLineId: function(){
                    return editor.getCurrentLine() ? editor.getCurrentLine().id : null;
                },

                deleteLine: function(line){
                    editor.deleteLine(line);
                    $rootScope.$emit('editor', { name: 'lines', action: 'delete' });
                    $rootScope.$emit('editor', { name: 'lines', action: 'select', line: editor.getCurrentLine() });
                },

                addLine: function(name, color, settings){
                    var line = editor.addLine(name, color, settings);
                    $rootScope.$emit('editor', { name: 'lines', action: 'add', line: line });
                },

                getSchemes: function(){
                    var schemes = [];
                    var dict = editor.getSchemes();
                    for(var key in dict){
                        var scheme = dict[key];
                        schemes.push({
                            id: scheme.id,
                            name: scheme.name,
                            default: scheme.id === PmzUtils.constants.DEFAULT_MAP_NAME
                        });
                    }
                    return schemes;                    
                },

                setCurrentSchemeId: function(id){
                    var scheme = editor.getSchemes()[id];
                    if(scheme){
                        editor.setCurrentScheme(scheme);
                    }else{
                        editor.setCurrentScheme(null);
                    }
                    $rootScope.$emit('editor', { name: 'schemes', action: 'select', scheme: editor.getCurrentScheme() });
                    $rootScope.$emit('editor', { name: 'lines', action: 'select', line: editor.getCurrentLine() });
                },

                getCurrentSchemeId: function(){
                    return editor.getCurrentScheme() ? editor.getCurrentScheme().id : null;
                },

                deleteScheme: function(scheme){
                    editor.deleteScheme(scheme);
                    $rootScope.$emit('editor', { name: 'schemes', action: 'delete' });
                    $rootScope.$emit('editor', { name: 'schemes', action: 'select', scheme: editor.getCurrentScheme() });
                    $rootScope.$emit('editor', { name: 'lines', action: 'select', line: editor.getCurrentLine() });
                },

                addScheme: function(name, type, settings){
                    var scheme = editor.addScheme(name, type, settings);
                    $rootScope.$emit('editor', { name: 'schemes', action: 'add', scheme: scheme });
                }


            };


            return service;
        });
})();