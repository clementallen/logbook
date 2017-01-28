const middleware = require('../modules/middleware');

module.exports = (app, passport) => {
    app.get('/signin', middleware.signedOutOnly, (req, res) => {
        res.render('signin', {
            title: 'Logbook | Signin',
            message: req.flash('message')
        });
    });

    app.post('/signin', middleware.signedOutOnly, passport.authenticate('local-login', {
        failureRedirect: '/signin',
        failureFlash: true
    }), (req, res) => {
        const ptrt = req.session.ptrt ? req.session.ptrt : '/';
        delete req.session.ptrt;
        res.redirect(ptrt);
    });
};
