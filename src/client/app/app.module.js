'use strict';

(function () {
    angular
        .module('app', [
            /* Shared Modules */
            'app.core',
            'app.shared',
            /* Feature Modules */
            'app.user'
        ])
        /* @ngInject */
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('access');
        });
})();