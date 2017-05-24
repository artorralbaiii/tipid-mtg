'use strict';

(function () {
    angular.module('app.user')
        .config(getRoutes);

    getRoutes.$inject = ['$routeProvider', '$locationProvider'];

    function getRoutes($routeProvider, $locationProvider) {
        $routeProvider
            .when('/register', {
                templateUrl: 'app/user/registration.html',
                controller: 'Register',
                controllerAs: 'vm'
            })
            .when('/login', {
                templateUrl: 'app/user/login.html',
                controller: 'Login',
                controllerAs: 'vm'
            })
            .otherwise({ redirectTo: '/' });

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }

})();