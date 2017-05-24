'use strict';

let passport = require('passport');
let LocalStrategy = require('passport-local');

let User = require('../models/user');

passport.use(new LocalStrategy({ session: false },
    (username, password, done) => {
        User.findOne({ username: username })
            .select('username password').exec((err, user) => {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'invalid user.' });
                }
                if (!user.comparePassword(password)) {
                    return done(null, false, { message: 'invalid password.' });
                }
                return done(null, user);
            });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

module.exports = () => {
    var ctrl = {
        login: login,
        register: register
    };

    return ctrl;

    /* Implementations */

    function register(req, res, next) {
        let newUser = new User({
            contact: req.body.contact,
            fullname: req.body.fullname,
            location: req.body.location,
            username: req.body.username,
            password: req.body.password
        });

        newUser.save((err, user) => {
            if (err) { next(err); }
            res.status = 200;
            res.json({
                message: 'success',
                data: user
            });
        });
    }

    function login(req, res, next) {
        passport.authenticate('local', (err, user, info) => {
            if (err) { return next(err); }
            if (!user) { return res.json(info); }

            req.logIn(user, function (err) {
                if (err) { return next(err); }
                return res.json(user);
            });
        })(req, res, next);
    }
};