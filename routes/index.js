export default (app) => {
    const years = [];
    for (let i = 2014; i <= new Date().getFullYear(); i++) {
        years.push(i);
    }
    app.get('/', (req, res) => {
        res.render('logbook', {
            title: 'HCV Logbook',
            signedIn: req.isAuthenticated(),
            message: req.flash('message'),
            years,
            helpers: {
                raw: (content) => {
                    return content.fn();
                }
            }
        });
    });
};
