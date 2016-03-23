(function () {
    'use strict';

    angular
        .module('aMetroEditor')
        .factory('ModelService', function($rootScope, $timeout){
            var self = this;
            self.model = PmzModelFile.create();
            self.file = null;

            $timeout(function(){
                $rootScope.$broadcast('model', self.model);
            }, 0);


            return {
                newMap: function(){
                    self.model = PmzModelFile.create();
                    self.file = null;
                    $rootScope.$broadcast('model', self.model);
                },

                loadMap: function(file){
                    self.model = PmzModelFile.load(file);
                    self.file = file;
                    $rootScope.$broadcast('model', self.model);
                },

                saveMap: function(){
                    if(!self.file){
                        self.file = {
                            name: self.model.metadata.name + '.pmz',
                            type: 'application/zip',
                            content: (new JSZip()).generate({type:'arraybuffer'})
                        };
                    }
                    PmzModelFile.save(self.file, self.model);
                    return self.file;
                },

                getMetadata: function(){
                    return self.model.metadata;
                },

                getModel: function(){
                    return self.model;
                },

                getTransportTypes: function(){
                    return {
                        'Метро': 'Metro',
                        'Трамвай': 'Tram',
                        'Автобус': 'Bus',
                        'Электричка': 'Train',
                        'Речной Трамвай': 'Ferry',
                        'Троллейбус': 'Trolleybus',
                        'Фуникулер': 'Funicular'
                    };
                }
            };

        })
})();
