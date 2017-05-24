'use strict';

let jsonwebtoken = require('jsonwebtoken');
let LocalStrategy = require('passport-local');
let passport = require('passport');

let User = require('../models/user');

let secretKey = process.env.APP_SECRET;

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

function createToken(user) {
    var token = jsonwebtoken.sign({
        id: user._id,
        username: user.username,
        fullname: user.fullname
    }, secretKey, {
            expiresIn: '24H'
        });

    return token;
}

module.exports = () => {
    var ctrl = {
        changePassword: changePassword,
        get: get,
        login: login,
        update: update
    };

    return ctrl;

    /* Implementations */

    function changePassword(req, res, next) {
        User.findById(req.params.id, (err, user) => {
            if (err) { next(200); }
            user.password = req.body.password;
            user.save((err, user) => {
                if (err) { next(err); }
                res.json({ data: user });
            });
        });
    }

    function get(req, res, next) {
        if (req.params.id) {
            User.findById(req.params.id, (err, user) => {
                if (err) { next(err); }
                res.json({ data: user });
            });
        } else {
            User.find({}, (err, users) => {
                if (err) { next(err); }
                res.json({ data: users });
            });
        }
    }

    function login(req, res, next) {
        passport.authenticate('local', (err, user, info) => {
            if (err) { return next(err); }
            if (!user) { return res.json(info); }

            req.logIn(user, function (err) {
                if (err) { return next(err); }

                let token = createToken(user);
                return res.json({ data: user, token: token });
            });
        })(req, res, next);
    }

    function update(req, res, next) {
        if (req.params.id) {
            User.findById(req.params.id, (err, user) => {
                if (err) { next(err); }
                user.contact = req.body.contact;
                user.email = req.body.email;
                user.fullname = req.body.fullname;
                user.location = req.body.location;

                user.save((err, user) => {
                    if (err) { next(err); }
                    res.status(200);
                    res.json({ data: user });
                });
            });
        } else {
            let newUser = new User({
                contact: req.body.contact,
                email: req.body.email,
                fullname: req.body.fullname,
                location: req.body.location,
                username: req.body.username,
                password: req.body.username
            });

            

            newUser.save((err, user) => {
                if (err) { next(err); }
                let token = createToken(user);
                res.status(200);
                res.json({ data: user, token: token });
            });
        }
    }

};