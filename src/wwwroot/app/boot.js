(function () {
    'use strict';

    angular
        .module('aMetroEditor', ['ngMaterial', 'ngRoute', 'ngAnimate'])
        .config(function ($mdIconProvider, $mdThemingProvider,$routeProvider, $locationProvider) {
            $mdIconProvider
                .defaultIconSet('img/icons/sets/core-icons.svg', 24)
                .iconSet('icons',           'img/icons/sets/iron-icons.svg', 24)
                .iconSet('av',              'img/icons/sets/av-icons.svg', 24)
                .iconSet('communication',   'img/icons/sets/communication-icons.svg', 24)
                .iconSet('device',          'img/icons/sets/device-icons.svg', 24)
                .iconSet('editor',          'img/icons/sets/editor-icons.svg', 24)
                .iconSet('hardware',        'img/icons/sets/hardware-icons.svg', 24)
                .iconSet('image',           'img/icons/sets/image-icons.svg', 24)
                .iconSet('maps',            'img/icons/sets/maps-icons.svg', 24)
                .iconSet('notification',    'img/icons/sets/notification-icons.svg', 24)
                .iconSet('places',          'img/icons/sets/places-icons.svg', 24)
                .iconSet('social',          'img/icons/sets/social-icons.svg', 24)
                ;

            $mdThemingProvider.theme('default')
                .primaryPalette('green')
                .accentPalette('deep-orange');

            $mdThemingProvider.theme('docs-dark', 'default')
                .primaryPalette('yellow')
                .dark();

            //$locationProvider.html5Mode(true);

            $routeProvider
                .when('/', { templateUrl: 'app/pages/start.html', reloadOnSearch:false })
                .when('/map/editor', { templateUrl: 'app/map/editor/editor.html', reloadOnSearch:false })
                .when('/map/editor/:mode', { templateUrl: 'app/map/editor/editor.html', reloadOnSearch:false })
                .when('/map/details', { templateUrl: 'app/map/details/details.html', reloadOnSearch:false })

                .when('/help', { templateUrl: 'app/pages/help.html', reloadOnSearch:false })
                .when('/about', { templateUrl: 'app/pages/about.html', reloadOnSearch:false })
                .otherwise('/');

        })
        .controller('AppController', function ($scope, $rootScope, $timeout, $mdSidenav, $location, ModelService) {

            var self = this;

            this.toggleLeft = buildDelayedToggler('left');
            this.toggleRight = buildToggler('right');
            this.closeRight = function () { $mdSidenav('right').close(); };

            this.settings = {
                metadata: ModelService.getMetadata()
            };

            this.navigate = function (name, ev) {
                $scope.$emit('navigate', { navigate:name, event: ev });
            };

            $scope.$on('$destroy', $rootScope.$on('navigate', function(event,data){
                $location.path(data.navigate);
            }));

            $scope.$on('$destroy', $rootScope.$on('editor', function(event,data){
            }));

            $scope.$on('toolbar', function(event,data){
            });

            $scope.$on('navigate', function(event,data){
            });

            $scope.$on('model', function(event,data){
                self.settings.metadata = ModelService.getMetadata();
                console.log(ModelService.getModel());
            });

            $scope.$on('menu', function(event,data){
                if(data.name === 'help'){
                    $location.path('/help');
                }
                if(data.name === 'license'){
                    $location.path('/license');
                }
            });

            function debounce(func, wait, context) {
                var timer;
                return function debounced() {
                    var context = $scope;
                    var args = Array.prototype.slice.call(arguments);
                    $timeout.cancel(timer);
                    timer = $timeout(function () {
                        timer = undefined;
                        func.apply(context, args);
                    }, wait || 10);
                };
            }
            function buildDelayedToggler(navID) { return debounce(function () { $mdSidenav(navID).toggle(); }, 200); }
            function buildToggler(navID) { return function () { $mdSidenav(navID).toggle(); } }
        })
    ;
})();
