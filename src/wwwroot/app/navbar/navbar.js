(function () {
    'use strict';

    angular
        .module('aMetroEditor')
        .controller('NavigationController', function NavigationController($scope, $rootScope, $location) {

            var self = this;

            this.settings = {
                modes: [
                    { name: 'Map Information', event: 'map/info', icon:'icons:info' },
                    { name: 'Stations and Lines', event: 'map/editor/stations', icon:'icons:timeline' },
                    { name: 'Transfers', event: 'map/editor/transfers', icon:'maps:directions-walk' },
                    { name: 'Background', event: 'map/editor/background', icon:'maps:map' },
                    { name: 'Timings', event: 'map/editor/timings', icon:'image:timer' },
                    { name: 'Translation', event: 'map/editor/translations', icon:'icons:translate' },
                ],
                pages: [
                    { name: 'Contacts', event: 'contacts', icon:'social:people' },
                    { name: 'Help', event: 'help', icon:'icons:help' },
                    { name: 'License', event: 'license', icon:'icons:work' },
                    { name: 'Settings', event: 'settings', icon:'icons:settings' }
                ],
            };

            this.getItemStyle = function(item){
                return $location.path() === '/' + item.event ? 'active-list-item' : '';
            }

            this.emit = function (name, ev) {
                $scope.$emit('navigate', { navigate: name, event: ev });
            };

            $scope.$on('$destroy', $rootScope.$on('editor', function(event, data){
                if(data.name !== 'mode'){
                    return;
                }
                
                self.settings.active = data.mode;
            }));

            return this;
        });
        
})();
