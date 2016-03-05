(function () {
    'use strict';

    angular
    .module('aMetroEditor')
    .controller('MapDetailsController', function MapDetailsController($scope, ModelService) {

        var self = this;

        this.countries = [
            'Russia',
            'France',
            'Poland'
        ];

        this.cities = [
            'Moscow',
            'Kazan',
            'Poltava',
            'Poznan',
            'Paris'
        ];

        this.settings = {
            metadata: ModelService.getMetadata()
        };

        $scope.$on('model', function(event,data){
            self.settings.metadata = ModelService.getMetadata();
        });

    });

})();
