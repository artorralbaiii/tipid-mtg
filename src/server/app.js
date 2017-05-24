'use strict';

//  Vendor Packages 
let express = require('express');
let bodyParser = require('body-parser');
let logger = require('morgan');
let compress = require('compression');
let mongoose = require('mongoose');
let passport = require('passport');

// Application Packages
let errHandler = require('./shared/errorHandler')();

// Environment Variables
let port = process.env.PORT || 3000;
let environ = process.env.NODE_ENV || 'dev';
let dbUser = process.env.DB_USER || '';
let dbPassword = process.env.DB_PWD || '';
let dbHost = process.env.DB_HOST || '';
let dbName = process.env.DB_NAME || '';
let connString = 'mongodb://' + dbUser + ':' + dbPassword + '@' + dbHost + '/' + dbName;

// Database Connection
mongoose
    .connect(connString, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Connected to database...');
        }
    });

// Web Server Variables
let app = express();

// Middlewares 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compress());
app.use(logger('dev'));
app.use(errHandler.handle);
app.use(passport.initialize());

// API Router
var api = require('./api.js')(express);
app.use('/api', api);

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environ);

switch (environ) {
    case 'build':
        console.log('** BUILD ***');
        app.use(express.static('./build/'));
        break;
    default:
        console.log('** DEV **');
        app.use(express.static('./bower_components/'));
        app.use(express.static('./src/client/'));
        app.use(express.static('./'));
        app.use('/*', express.static('./src/client/index.html'));
        break;
}

app.listen(port, () => {
    console.log('Express server is listening on port ' + port);
    console.log('\n ___dirname = ' + __dirname + '\nprocess.cwd = ' + process.cwd());
});