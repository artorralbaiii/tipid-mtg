'use strict';

(function () {
    angular.module('app.core')
        .factory('access', access);

    access.$inject = ['$q', '$location', 'auth'];

    function access($q, $location, auth) {
        var service = {
            request: request
        };

        return service;

        /* Implementations */

        function request(config) {
            var token = auth.getToken();

            if (token) {
                config.headers['x-access-token'] = token;
            }

            return config;
        }
    }
})();