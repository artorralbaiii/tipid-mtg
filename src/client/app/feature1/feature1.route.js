'use strict';

(function () {
    angular.module('app.feature1')
        .config(getRoutes);

    getRoutes.$inject = ['$routeProvider', '$locationProvider'];

    function getRoutes($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/feature1/feature1.html',
                controller: 'Feature1',
                controllerAs: 'vm'
            })
            .otherwise({ redirectTo: '/' });
    }
})();