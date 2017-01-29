export default (app, passport) => {
    app.get('/signout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
};
