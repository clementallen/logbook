import { signedOutOnly } from '../modules/middleware';

export default (app, passport) => {
    app.get('/register', signedOutOnly, (req, res) => {
        res.render('register', {
            title: 'Logbook | Register',
            message: req.flash('message')
        });
    });

    app.post('/register', signedOutOnly, passport.authenticate('local-signup', {
        failureRedirect: '/register',
        failureFlash: true
    }), (req, res) => {
        const ptrt = req.session.ptrt ? req.session.ptrt : '/';
        delete req.session.ptrt;
        res.redirect(ptrt);
    });
};
