'use strict';

(function () {
    angular.module('app.core')
        .factory('auth', auth);

    auth.$inject = ['$log', '$window'];

    function auth($log, $window) {
        var service = {
            getToken: getToken,
            setToken: setToken
        };

        return service;

        /* Implementations */

        function setToken(token) {
            if (token) {
                $window.localStorage.setItem('token', token);
            } else {
                $window.localStorage.removeItem('token');
            }
        }

        function getToken() {
            return $window.localStorage.getItem('token');
        }
    }
})();