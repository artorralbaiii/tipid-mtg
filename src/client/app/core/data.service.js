'use strict';

(function () {
    angular.module('app.core')
        .factory('dataservice', dataservice);

    dataservice.$inject = ['$http', '$log'];

    function dataservice($http, $log) {
        var service = {
            hello: hello
        };

        return service;

        /* Implementations */

        function hello() {
            return $http.get('/api/hello')
                .then(function (data, status, headers, config) {
                    return data.data;
                })
                .catch(function (msg) {
                    $log.error(msg);
                });
        }
    }
})();