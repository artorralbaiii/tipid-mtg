'use strict';

(function () {
    angular.module('app.core')
        .factory('dataservice', dataservice);

    dataservice.$inject = ['$http', '$log'];

    function dataservice($http, $log) {
        var service = {
            createUser: createUser,
            login: login
        };

        return service;

        /* Implementations */

        function createUser(user) {
            return $http.post('/api/user', user)
                .then(function (data, status, headers, config) {
                    return data.data;
                })
                .catch(function (msg) {
                    $log.error(msg);
                });
        }

        function login(user) {
            return $http.post('/api/login', user)
                .then(function (data, status, headers, config) {
                    return data.data;
                })
                .catch(function (msg) {
                    $log.error(msg);
                });
        }


    }
})();