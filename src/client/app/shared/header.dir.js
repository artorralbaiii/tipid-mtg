'use strict';

(function () {
    angular.module('app.shared')
        .directive('appHeader', function () {
            return {
                restrict: 'AE',
                templateUrl: 'app/shared/header.html'
            };
        });
})();