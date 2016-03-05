(function () {
    'use strict';

    angular
        .module('aMetroEditor')
        .controller('ToolbarController', function ToolbarController($scope, $rootScope, $location,EditorService) {
            var self = this;

            this.settings = {
                visible: true,

                cut: false,
                copy: false,
                paste: false,
                connect: false,
                delete: false,

                lines: EditorService.getLines(),
                currentLineId: EditorService.getCurrentLineId(),

                schemes: EditorService.getSchemes(),
                currentSchemeId: EditorService.getCurrentSchemeId()
            };

            this.emit = function (name, ev) {
                if(name === 'connect'){
                    EditorService.connectSelection();
                    return;
                }
                if(name === 'delete'){
                    EditorService.deleteSelection();
                    return;
                }

                $scope.$emit('toolbar', { name: name, event: ev });
            };
            
            $scope.$on('$destroy', $rootScope.$on('editor', function(event, data){
                if(data.name === 'selection'){
                    var size = data.selection.length;
                    self.settings['cut'] = size >= 1;
                    self.settings['copy'] = size >= 1;
                    self.settings['connect'] = size > 1;
                    self.settings['delete'] = size >= 1;
                }
                if(data.name === 'schemes'){
                    self.settings.schemes = EditorService.getSchemes();
                    self.settings.currentSchemeId = EditorService.getCurrentSchemeId();
                }
                if(data.name === 'lines'){
                    self.settings.lines = EditorService.getLines();
                    self.settings.currentLineId = EditorService.getCurrentLineId();
                }
            }));
            

            $scope.$watch(function(){ return self.settings.currentLineId; }, function(newValue, oldValue){
                EditorService.setCurrentLineId(newValue);
            });

            $scope.$watch(function(){ return self.settings.currentSchemeId; }, function(newValue, oldValue){
                EditorService.setCurrentSchemeId(newValue);
            });

            $scope.$watch(function(){ return $location.path(); }, function(newValue, oldValue){
                self.settings.visible = newValue.startsWith('/map/editor');
            });

            return this;          
        });
})();
