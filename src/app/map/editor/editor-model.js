function EditorModel(canvasElement, imageElement, callbacksObject) {
    'use strict';

    callbacksObject = callbacksObject || {};
    callbacksObject.onSelectionChanged = callbacksObject.onSelectionChanged || function(){};
    callbacksObject.onBackgroundLoaded = callbacksObject.onBackgroundLoaded || function(){};

    var settings = {
        backgroundOpacity: 0.1,
        stationDiameter: 16,
        stationLineWidth: 1,
        stationLineColor: 'white',
        lineWidth: 10,
        stations: [],
        selection: [],
        patches: [],
        backgroundImage: null,

        imageElement: imageElement,
        callbacks: callbacksObject,
        events: {},

        model: {
            metadata: {},
            transports: {},
            schemes: {}
        },

        currentScheme: null,
        currentLine: null
    };

    paper.setup(canvasElement);

    var backgroundLayer = new paper.Layer({opacity: settings.backgroundOpacity});
    var linesLayer = new paper.Layer();
    var stationsLayer = new paper.Layer();
    var transfersLayer = new paper.Layer();
    stationsLayer.activate();

    $(settings.imageElement).load(function (){
        if(settings.backgroundImage){
            settings.backgroundImage.remove();
        }
        backgroundLayer.activate();
        settings.backgroundImage = new paper.Raster(settings.imageElement);
        settings.backgroundImage.position = [settings.backgroundImage.width/2, settings.backgroundImage.height/2];
        stationsLayer.activate();
        paper.view.draw();
        fireBackgroundLoaded();
    });

    function fireSelectionChanged(){
        if(settings.events.onSelectionChangedFired){
            return;
        }
        settings.events.onSelectionChangedFired = true;
        setTimeout(function(){
            settings.events.onSelectionChangedFired = false;
            settings.callbacks.onSelectionChanged();
        }, 0);
    }

    function fireBackgroundLoaded(){
        if(settings.events.onBackgroundLoadedFired){
            return;
        }
        settings.events.onBackgroundLoadedFired = true;
        setTimeout(function(){
            settings.events.onBackgroundLoadedFired = false;
            settings.callbacks.onBackgroundLoaded();
        }, 0);
    }

    function addSelection(item) {
        if (settings.selection.indexOf(item) === -1) {
            settings.selection.push(item);
            item.selected = true;
        }
        fireSelectionChanged();
    }

    function removeSelection(item) {
        if (settings.selection.indexOf(item) !== -1) {
            settings.selection.pop(item);
            item.selected = true;
        }
        fireSelectionChanged();
    }

    function clearSelection() {
        var cleared = settings.selection.length > 0;
        while (settings.selection.length > 0) {
            settings.selection.pop().selected = false;
            fireSelectionChanged();
        }
        return cleared;
    }
    
    function hasSelection(){
        return settings.selection.length > 0;
    }

    function isSelected(item){
        return settings.selection.indexOf(item)!== -1;
    }

    function isStation(item){
        return settings.stations.indexOf(item) !== -1;                
    }            
    
    function isLine(item){
        return settings.patches.indexOf(item) !== -1;                
    }            
    
    function moveStation(station, point){
        station.position = point;
        station.$from.forEach(function (path) {
            path.segments[0].point = point;
        });
        station.$to.forEach(function (path) {
            path.segments[1].point = point;
        });
        
    }

    var click;
    var clickItem;
    var dragBox;
    
    var tool = new paper.Tool();
    tool.minDistance = 2;
    tool.onMouseDown = function (event) {
        click = true;
        clickItem = event.item;
    }

    tool.onMouseDrag = function (event) {
        if (isStation(clickItem) && isSelected(clickItem)){

            settings.selection.forEach(function(station){
                var position = station.position;
                moveStation(station, position.add(event.delta));
            });

            click = false;
            return;
        }


        if (isStation(clickItem)) {
            if(click){
                clearSelection();
                addSelection(clickItem);
            }
            moveStation(clickItem, event.point);
            click = false;
            return;
        }
        
        if(dragBox){
            dragBox.remove();
        }
        dragBox = paper.Shape.Rectangle({
            from: event.downPoint, 
            to: event.point,
            strokeColor: 'black' 
        });
        
        click = false;
    }

    tool.onMouseUp = function (event) {
        if(event.event.button === 2){
            event.stop();
        }


        if(!click){
            if(dragBox){
                clearSelection();
                settings.stations.forEach(function(s){
                    if(dragBox.contains(s.bounds)){
                        addSelection(s);
                    }
                });
                dragBox.remove()
                dragBox = null;
            }
            
            return;
        }

        var selectionCleared = false;

        if (!event.event.shiftKey) {
            selectionCleared = clearSelection();                        
        }

        if (event.item){
            if(isStation(event.item)) {
                addSelection(event.item);
                return;
            }
        }

        if(selectionCleared){
            return;
        }

        var station = new paper.Path.Circle({
            center: event.point,
            radius: settings.stationDiameter/2,
            strokeWidth: settings.stationLineWidth,
            strokeColor: settings.stationLineColor,
            fillColor: settings.currentLine.color,
            parent: stationsLayer
        });

        station.$from = [];
        station.$to = [];
        settings.stations.push(station);

        if (event.event.shiftKey) {
            addSelection(station);
        }                
    }

    function validateStation(item){
        if(!isStation(item)){
            throw TypeError('Station ' + item + ' not found');
        }
    }

    function validateStations(arr){
        for(var i=0;i<arr.length;i++){
            validateStation(arr[i]);
        }
    }

    function removeStation(item){
        settings.stations.remove(item);
        if(isSelected(item)){
            settings.selection.remove(item);
            fireSelectionChanged();
        }
        item.$from.filter(function(){return true;}).forEach(function(p1){
            p1.$from.$from.remove(p1);
            p1.$to.$to.remove(p1);
            p1.remove();
            settings.patches.splice(settings.patches.indexOf(p1),1);
        });
        item.$to.filter(function(){return true;}).forEach(function(p2){
            p2.$from.$from.remove(p2);
            p2.$to.$to.remove(p2);
            p2.remove();
            settings.patches.splice(settings.patches.indexOf(p2),1);
        });
        item.remove();
    }

    function connectStations(from, to) {

        var path = new paper.Path.Line({
            from: from.position,
            to: to.position,
            strokeColor: settings.currentLine.color,
            strokeWidth: settings.lineWidth,
            parent: linesLayer
        });

        from.$from.push(path);
        to.$to.push(path);

        path.$from = from;
        path.$to = to;

        settings.patches.push(path);

    };

    function reloadProject(){
        if(!settings.currentScheme){
            return;
        }

        linesLayer.removeChildren();
        stationsLayer.removeChildren();
        transfersLayer.removeChildren();
        
        stationsLayer.activate();

        var defaultScheme = settings.model.schemes[PmzUtils.constants.DEFAULT_MAP_NAME];

        for(var lineName in settings.currentScheme.lines){

            var line = settings.currentScheme.lines[lineName];
            var defaultLineColor = defaultScheme && defaultScheme.lines[lineName] 
                ? defaultScheme.lines[lineName].color 
                : PmzUtils.constants.DEFAULT_LINE_COLOR;

            line.coords.forEach(function(c){
                if(c.isEmpty()){
                    return;
                }
                var station = new paper.Shape.Circle({
                    center: [c.x, c.y],
                    radius: settings.currentScheme.options.stationDiameter/2,
                    strokeWidth: settings.stationLineWidth,
                    strokeColor: settings.stationLineColor,
                    fillColor: line.color || defaultLineColor,
                    parent: stationsLayer
                });
                station.$from = [];
                station.$to = [];
                settings.stations.push(station);
            });


        }

        paper.view.draw();
    }

    return {

        deleteStations : function(arr){
            validateStations(arr);
            for(var i=0;i<arr.length;i++){
                removeStation(arr[i]);
            }
            paper.view.draw();
        },

        connectStations : function(arr){
            validateStations(arr);
            for(var i=0;i<(arr.length-1); i++) {
                connectStations(settings.selection[i], settings.selection[i+1])
            }
            paper.view.draw();
        },

        getSelectedStations: function(){
            return settings.selection.slice(0);
        },

        showBackgroundLayer: function(){
            backgroundLayer.visible = true;
            backgroundLayer.opacity = 1.0;
            linesLayer.visible = false;
            stationsLayer.visible = false;
            paper.view.draw();
        },

        showVectorLayer: function(){
            backgroundLayer.visible = false;
            backgroundLayer.opacity = settings.backgroundOpacity;
            linesLayer.visible = true;
            stationsLayer.visible = true;
            paper.view.draw();
        },

        showAllLayers: function(){
            backgroundLayer.visible = true;
            backgroundLayer.opacity = settings.backgroundOpacity;
            linesLayer.visible = true;
            stationsLayer.visible = true;
            paper.view.draw();
        },

        setBackgroundAsync: function(url){
            settings.imageElement.src = url;
        },



        getLines: function(){
            return settings.currentScheme ? settings.currentScheme.lines : [];
        },

        setCurrentLine: function(line){
            settings.currentLine = line;
        },

        getCurrentLine: function(){
            return settings.currentLine;
        },

        deleteLine: function(line){
            settings.currentScheme.lines.remove(line);
            if(line == settings.currentLine){
                settings.currentLine = settings.currentScheme.lines.length > 0 ? settings.currentScheme.lines[0] : null;
            }

        },

        addLine: function(name, color, settings){
            var newLine = {
                id: new Date().getTime(),
                name: name,
                color: color,
                settings: settings
            };
            settings.currentScheme.lines.push(newLine);
            return newLine;
        },

        getSchemes: function(){
            return settings.model.schemes;
        },

        setCurrentScheme: function(scheme){
            settings.currentScheme = scheme;
            if(scheme){
                settings.currentLine = settings.currentScheme.lines[Object.keys(settings.currentScheme.lines)[0]];
                reloadProject();
            }else{
                settings.currentLine = null;
            }
        },

        getCurrentScheme: function(){
            return settings.currentScheme;
        },

        deleteScheme: function(scheme){
            settings.schemes.remove(scheme);
            if(scheme == settings.currentScheme){
                settings.currentScheme = settings.schemes.length > 0 ? settings.schemes[0] : null;
                if(settings.currentScheme){
                    settings.currentLine = settings.currentScheme.lines.length > 0 ? settings.currentScheme.lines[0] : null;
                }else{
                    settings.currentLine = null;
                }
            }
        },

        addScheme: function(name, type, settings){
            var newScheme = {
                id: new Date().getTime(),
                name: name,
                type: type,
                settings: settings,
                lines: []
            };
            settings.currentScheme.lines.push(newScheme);
            return newScheme;
        },        

        setDataModel: function(newModel){
            settings.model = newModel;
            settings.currentScheme = settings.model.schemes['Metro.map'];
            settings.currentLine = settings.currentScheme.lines[Object.keys(settings.currentScheme.lines)[0]];
            reloadProject();
            paper.view.draw();
        },

        setEditorSize: function(width, height){
            paper.view.viewSize = [width, height];
            paper.view.draw();
        }

    };
};

