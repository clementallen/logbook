export default (app) => {
    app.get('/', (req, res) => {
        res.render('logbook', {
            title: 'HCV Logbook',
            signedIn: req.isAuthenticated(),
            message: req.flash('message'),
            years: [2014, 2015, 2016, 2017],
            helpers: {
                raw: (content) => {
                    return content.fn();
                }
            }
        });
    });
};
