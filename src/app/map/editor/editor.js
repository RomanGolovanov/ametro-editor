(function () {
    'use strict';

    angular
        .module('aMetroEditor')
        .directive('mapEditor', function(){
            return {
                restrict: 'E',
                controller: function($scope, $element, $window, $timeout, EditorService){
                    var element = $element[0];
                    var resizeDelay = 50;

                    cacheElementSize();

                    EditorService.attach($element[0]);
                    $window.addEventListener('resize', onWindowResize);

                    $timeout(onWindowResize, resizeDelay);

                    $scope.$on('$destroy', function(){
                        $window.removeEventListener('resize', onWindowResize);
                        EditorService.detach();
                    });


                    function cacheElementSize() {
                        $scope.cachedElementWidth = element.offsetWidth;
                        $scope.cachedElementHeight = element.offsetHeight;
                    }

                    function onWindowResize() {
                        console.log(element.offsetWidth + 'x' + element.offsetHeight);
                        var isSizeChanged = $scope.cachedElementWidth != element.offsetWidth || $scope.cachedElementHeight != element.offsetHeight;
                        if (isSizeChanged) {
                            EditorService.resize(element.offsetWidth, Math.max(element.offsetHeight, element.offsetWidth));
                            cacheElementSize();
                            $timeout(onWindowResize, resizeDelay);
                        }
                    };
                }
            };
        });
})();
