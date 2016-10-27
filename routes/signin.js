var middleware = require('../modules/middleware');

module.exports = function(app, passport) {
    app.get('/signin', middleware.signedOutOnly, function(req, res) {
        res.render('signin', {
            title: 'Logbook | Signin',
            message: req.flash('message')
        });
    });

    app.post('/signin', middleware.signedOutOnly, passport.authenticate('local-login', {
        failureRedirect: '/signin',
        failureFlash: true

    }), function(req, res) {
        var ptrt = req.session.ptrt ? req.session.ptrt : '/';
        delete req.session.ptrt;
        res.redirect(ptrt);
    });
};
