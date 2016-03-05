(function () {
    'use strict';

    angular
        .module('aMetroEditor')
        .controller('MenuController', function MenuController($scope, $rootScope, $mdDialog, $timeout,EditorService, FileService, ModelService) {

            var self = this;

            this.settings = {
                edit:{
                    undo: false,
                    redo: false,
                    cut: false,
                    copy: false,
                    paste: false,

                },
                view: {
                    layers: 'all'
                },
                help: {
                    items: [
                        { name: 'Help', url: 'help', icon:'icons:help' },
                        { name: 'Contacts', url: 'contacts', icon:'social:people' },
                        { name: 'About', url: 'about', icon:'icons:dashboard' }
                    ]
                },


                schemes: EditorService.getSchemes(),
                currentSchemeId: EditorService.getCurrentSchemeId(),

                lines: EditorService.getLines(),
                currentLineId: EditorService.getCurrentLineId(),

                transports: {
                    items: [{
                        id: 'Metro.trp',
                        name: 'Metro.trp',
                        type: 'Метро'
                    }],
                    current: 'Metro.trp'
                },

                translation: {
                    items: [
                        { id: 'ru', name: 'Russian' },
                        { id: 'en', name: 'English' }
                    ],
                    current: 'ru'
                }

            };
            
            this.hasEmptyLines = function(){
                return !(self.settings.lines && self.settings.lines.length > 0);
            };
           
            
            this.createMap = function(ev){
                ModelService.newMap();
            };

            this.uploadMap = function(ev){
                FileService.openFile(function(file){
                    $timeout(function(){
                        ModelService.loadMap(file);
                        $scope.$emit('navigate', { navigate:'map/editor', event: ev });
                    }, 0);
                }, function(error){
                    var alert = $mdDialog.alert()
                        .title('Cannot load file')
                        .textContent(error.message)
                        .ariaLabel('File loading error')
                        .targetEvent(ev)
                        .clickOutsideToClose(true)
                        .ok('Ok');
                    $mdDialog.show(alert);
                });
            };

            this.downloadMap = function(ev){
                var file = ModelService.saveMap();
                FileService.saveFile(file);
            };

            this.addLine = function(ev){
            };
            
            this.editLine = function(ev){
            };
            
            this.deleteLine = function(ev){
                var line = self.settings.lines.filter(function(l){ return l.id === self.settings.currentLineId })[0];
                var confirm = $mdDialog.confirm()
                      .title('Would you like to delete a line \'' + line.name + '\' ?')
                      .textContent('All of the stations on this line will be deleted also.')
                      .ariaLabel('Delete line confirmation')
                      .targetEvent(ev)
                      .ok('Yes')
                      .cancel('Cancel');
                $mdDialog.show(confirm).then(function() { 
                    EditorService.deleteLine(line); 
                });
            };
            
            this.editLineDefaults = function(ev){
            };


            this.addScheme = function(ev){
            };
            
            this.editScheme = function(ev){
            };
            
            this.deleteScheme = function(ev){
                var scheme = self.settings.schemes.filter(function(l){ return l.id === self.settings.currentSchemeId })[0];
                var confirm = $mdDialog.confirm()
                      .title('Would you like to delete a scheme \'' + scheme.name + '\' ?')
                      .textContent('All of the stations on this scheme will be deleted also.')
                      .ariaLabel('Delete scheme confirmation')
                      .targetEvent(ev)
                      .ok('Yes')
                      .cancel('Cancel');
                $mdDialog.show(confirm).then(function() { 
                    EditorService.deleteScheme(scheme); 
                });
            };
            
            this.editSchemeDefaults = function(ev){
            };



            this.emit = function (name, ev) {
                $scope.$emit('menu', { name: name, event: ev });
            };

            $scope.$on('$destroy', $rootScope.$on('editor', function(event, data){
                if(data.name === 'selection'){
                    var size = data.selection.length;

                    self.settings.edit.undo = false;
                    self.settings.edit.redo = false;
                    self.settings.edit.cut = size >= 1;
                    self.settings.edit.copy = size >= 1;
                    self.settings.edit.paste = false;
                    self.settings.edit.connect = size > 1;
                    self.settings.edit.delete = size >= 1;
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

            $scope.$watch(function(){ return self.settings.view.layers; }, function(newValue, oldValue){
            });

            $scope.$watch(function(){ return self.settings.currentLineId; }, function(newValue, oldValue){
                EditorService.setCurrentLineId(newValue);
            });

            $scope.$watch(function(){ return self.settings.currentSchemeId; }, function(newValue, oldValue){
                EditorService.setCurrentSchemeId(newValue);
            });

            return this;
        });
})();
