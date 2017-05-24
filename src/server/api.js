'use strict';
let jsonwebtoken = require('jsonwebtoken');
let passport = require('passport');

let postCtrl = require('./controllers/post.controller')();
let userCtrl = require('./controllers/user.controller')();

let secretKey = process.env.APP_SECRET;

module.exports = (express) => {

    let api = express.Router();

    // User ENDPOINT
    api.get('/user/:id?', verifyAccess, userCtrl.get);
    api.post('/user/cp/:id', verifyAccess, userCtrl.changePassword);
    api.post('/user/:id', verifyAccess, userCtrl.update);
    api.post('/user', userCtrl.update);
    api.post('/login', userCtrl.login);

    // Post ENDPOINT
    api.delete('/post/delete/:id', verifyAccess, postCtrl.remove);
    api.get('/post/:id?', verifyAccess, postCtrl.get);
    api.get('/post/type/:type', verifyAccess, postCtrl.getByType);
    api.post('/post/:id?', verifyAccess, postCtrl.update);

    return api;
};

function verifyAccess(req, res, next) {
    let token = req.query['x-access-token'] || req.headers['x-access-token'];

    if (token) {
        jsonwebtoken.verify(token, secretKey, (err, decoded) => {
            if (err) {
                res.status(403).send({ success: false, message: err.message });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(403).send({ success: false, message: 'No Token Provided!' });
    }
}