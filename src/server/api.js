'use strict';
let passport = require('passport');

let sellCtrl = require('./controllers/sell.controller')();
let userCtrl = require('./controllers/user.controller')();

module.exports = (express) => {

    let api = express.Router();

    api.use((req, res, next) => {
        req.currentUser = {
            _id: '59243172de303007ecd8d8cb',
            username: 'a.r.torralba.iii',
            password: '$2a$10$uALpehpdtBJmRR5barbxiOyMTNH2ep4T2dSD07XUz3.bMEUrS9OkG'
        };
        next();
    });

    // User ENDPOINT
    api.post('/user', userCtrl.register);
    api.post('/login', userCtrl.login);

    // Sell ENDPOINT
    api.get('/sell/:id?', sellCtrl.get);
    api.post('/sell', sellCtrl.create);

    return api;
};