module.exports = {
    signedInOnly: (req, res, next) => {
        if (req.isAuthenticated()) {
            next();
        } else {
            req.flash('message', 'Please sign in to access this page');
            req.session.ptrt = req.originalUrl;
            res.redirect('/signin');
        }
    },

    signedOutOnly: (req, res, next) => {
        if (req.isAuthenticated()) {
            req.flash('message', 'Please sign out to access this page');
            res.redirect('back');
        } else {
            next();
        }
    }
};
