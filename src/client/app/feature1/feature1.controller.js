'use strict';

(function () {
    angular.module('app.feature1')
        .controller('Feature1', Feature1);

    Feature1.$inject = ['dataservice'];

    function Feature1(dataservice) {
        var vm = this;
        vm.message = '<message>';

        hello();

        /* Implementations */

        function hello() {
            dataservice.hello()
                .then(function (data) {
                    vm.message = data.msg;
                });
        }

    }
})();