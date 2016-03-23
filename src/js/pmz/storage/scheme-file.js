
var PmzSchemeFile = (function(){
    'use strict';

    function loadMapOptions(ini){
        if(!ini){
            return {};
        }

        return {
            imageFileName: ini['ImageFileName'],
            stationDiameter: ini['StationDiameter'],
            lineWidth: ini['LinesWidth'],
            upperCase: ini['UpperCase'],
            wordWrap: ini['WordWrap'],
            isVector: ini['IsVector'],
            transports: PmzUtils.asArray(ini['Transports']),
            checkedTransports: PmzUtils.asArray(ini['CheckedTransports'])
        };
    }

    function loadAdditionalNodes(ini){
        if(!ini){
            return {};
        }

        var lineNodes = {};
        for(var key in ini){
            var item = ini[key];
            var node = PmzUtils.asAdditionalNodes(item);
            if(!lineNodes[node.line]){
                lineNodes[node.line] = [];
            }
            lineNodes[node.line].push(PmzUtils.asAdditionalNodes(item));
        }
        return lineNodes;
    }

    function loadMapLines(ini, lineNodes){
        var lines = {};
        for(var key in ini){
            var item = ini[key];

            lines[key] = new PmzSchemeLine(key, key,
                PmzUtils.asColor(item['Color']),
                item['LabelsColor'],
                item['LabelsBColor'],
                PmzUtils.asPmzPointArray(item['Coordinates']),
                PmzUtils.asPmzRectArray(item['Rects']),
                PmzUtils.asFloatArray(item['Heights']),
                PmzUtils.asPmzRect(item['Rect']),
                PmzUtils.asPmzRectArray(item['Rects2']),
                lineNodes[key] || [],
                true );
        }
        return lines;
    }

    function filterLineSections(ini, transports){
        var lineNames = [];
        Object.keys(transports).forEach(function(key){
            Array.prototype.push.apply(lineNames, Object.keys(transports[key].lines));
        });

        var sections = {};
        for(var key in ini){
            if(lineNames.indexOf(key)!==-1) {
                sections[key] = ini[key];
            }
        }      
        return sections;  
    }

    return {
        load: function(ini, name, metadata, transports){
            var options = loadMapOptions(ini['Options']);
            var additionalNodes = loadAdditionalNodes(ini['AdditionalNodes']);
            var lines = loadMapLines(filterLineSections(ini, transports), additionalNodes);
            return new PmzScheme(name, name, options, lines);
        },

        save: function(){
            throw new TypeError('Not implemented');
        }
    };

})();

