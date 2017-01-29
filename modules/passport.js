import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User';

export default (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, username, password, done) => {
        User.findOne({ username: username.toLowerCase() }, (err, user) => {
            if (err) {
                done(err);
            }

            if (user) {
                done(null, false, req.flash('message', 'That username is already taken'));
            } else {
                const newUser = new User();

                newUser.username = username;
                newUser.password = newUser.generateHash(password);

                newUser.save((error) => {
                    if (error) {
                        throw err;
                    }
                    done(null, newUser);
                });
            }
        });
    }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, username, password, done) => {
        User.findOne({ username: username.toLowerCase() }, (err, user) => {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, req.flash('message', 'No such user exists'));
            }

            if (!user.validPassword(password)) {
                return done(null, false, req.flash('message', 'Oops! Wrong password'));
            }

            return done(null, user);
        });
    }));
};
