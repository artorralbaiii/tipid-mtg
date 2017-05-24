'use strict';

(function () {
    angular.module('app.user')
        .controller('Login', Login);

    Login.$inject = ['$location', 'dataservice', 'auth'];

    function Login($location, dataservice, auth) {
        var vm = this;
        vm.user = {};
        vm.submit = submit;
        vm.error = '';

        /* Implementations */

        function submit() {
            vm.error = '';
            dataservice.login(vm.user)
                .then(function (data) {
                    if (data.token) {
                        auth.setToken(data.token);
                        $location.path('/');
                    } else {
                        vm.error = data.message;
                    }
                });
        }
    }

})();