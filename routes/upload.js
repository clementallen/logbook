import { signedInOnly } from '../modules/middleware';

export default (app) => {
    app.get('/upload', signedInOnly, (req, res) => {
        res.render('upload', {
            title: 'Logbook | Upload',
            signedIn: req.isAuthenticated(),
            message: req.flash('message')
        });
    });
};
