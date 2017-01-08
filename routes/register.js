const middleware = require('../modules/middleware');
const config = require('../config/config');

module.exports = (app, passport) => {
    app.get('/register', middleware.signedOutOnly, (req, res) => {
        if (config.flagpole.registerEnabled) {
            res.render('register', {
                title: 'Logbook | Register',
                message: req.flash('message')
            });
        } else {
            res.redirect('/');
        }
    });

    if (config.flagpole.registerEnabled) {
        app.post('/register', middleware.signedOutOnly, passport.authenticate('local-signup', {
            failureRedirect: '/register',
            failureFlash: true

        }), (req, res) => {
            const ptrt = req.session.ptrt ? req.session.ptrt : '/';
            delete req.session.ptrt;
            res.redirect(ptrt);
        });
    }
};
