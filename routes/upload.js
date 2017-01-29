import { signedInOnly } from '../modules/middleware';

export default (app) => {
    app.get('/upload', signedInOnly, (req, res) => {
        res.render('upload', {
            title: 'Logbook | Upload',
            message: req.flash('message')
        });
    });
};
