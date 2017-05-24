'use strict';

(function () {
    angular.module('app.user')
        .controller('Register', Register);

    Register.$inject = ['$location', 'dataservice', 'auth'];

    function Register($location, dataservice, auth) {
        var vm = this;
        vm.user = {};
        vm.submit = submit;

        /* Implementations */

        function submit() {
            dataservice.createUser(vm.user)
                .then(function (data) {
                    auth.setToken(data.token);
                    $location.path('/');
                });
        }
    }

})();