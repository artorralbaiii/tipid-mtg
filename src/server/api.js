'use strict';

let helloCtrl = require('./controllers/hello.controller')();

module.exports = (express) => {

    let api = express.Router();

    api.get('/hello', helloCtrl.hello);

    return api;
};