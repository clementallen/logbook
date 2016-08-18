module.exports = function(app, passport) {
    app.get('/signout',function(req, res) {
        req.logout();
        res.redirect('/');
    });
};