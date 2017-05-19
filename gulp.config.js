'use strict';

let client = './src/client/';
let clientApp = client + 'app/';
let server = './src/server/';
var temp = './.tmp/';

module.exports = () => {

    let config = {

        /* File Path */
        allJs: [
            './src/**/*.js',
            './*.js'
        ],
        build: './build',
        client: client,
        css: client + 'styles/**/*.css',
        htmltemplates: clientApp + '**/*.html',
        index: client + 'index.html',
        ignorePath: '/src/client/',
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],
        server: server,
        temp: temp,


        /**
         * browser sync
         */
        browserReloadDelay: 1000,

        /**
         * Bower and NPM locations
         */
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        },

        /* Node settings */
        defaultPort: 7203,
        nodeServer: './src/server/app.js',

        /**
         * template cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app.core',
                standAlone: false,
                root: 'app/'
            }
        },

        /**
         * optimized files
         */
        optimized: {
            app: 'app.js',
            lib: 'lib.js'
        }

    };

    config.getWiredepDefaultOptions = () => {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    return config;
};