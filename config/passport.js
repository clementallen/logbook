var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/User');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, username, password, done) {
        User.findOne({ 'username': username.toLowerCase() }, function(err, user) {
            if(err) {
                return done(err);
            }

            if(user) {
                return done(null, false, req.flash('message', 'That username is already taken'));

            } else {
                var newUser = new User();

                newUser.username = username;
                newUser.password = newUser.generateHash(password);

                newUser.save(function(err) {
                    if (err) {
                        throw err;
                    }
                    return done(null, newUser);
                });
            }

        });

    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, username, password, done) {
        User.findOne({ 'username': username.toLowerCase() }, function(err, user) {
            if (err) {
                return done(err);
            }

            if(!user) {
                return done(null, false, req.flash('message', 'No such user exists'));
            }

            if(!user.validPassword(password)) {
                return done(null, false, req.flash('message', 'Oops! Wrong password'));
            }

            return done(null, user);
        });

    }));

};