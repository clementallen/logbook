var middleware = require('../modules/middleware');

module.exports = function(app, passport) {
    app.get('/register', middleware.signedOutOnly, function(req, res) {
        res.render('register', {
            title: 'Logbook | Register',
            message: req.flash('message')
        });
    });

    app.post('/register', middleware.signedOutOnly, passport.authenticate('local-signup', {
        failureRedirect: '/register',
        failureFlash: true

    }), function(req, res) {
        var ptrt = req.session.ptrt ? req.session.ptrt : '/';
        delete req.session.ptrt;
        res.redirect(ptrt);
    });

};
